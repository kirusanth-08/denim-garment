import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { AdminLoginPayload, AdminLoginResponse, AdminSession, AdminUser } from '../../features/auth/types/admin';
import {
  apiFetch,
  apiRequest,
  clearStoredAdminSession,
  getStoredAdminSession,
  setStoredAdminSession,
} from '../../lib/api';

type AdminAuthContextValue = {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: AdminLoginPayload) => Promise<void>;
  refreshAdmin: () => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedSession = getStoredAdminSession<AdminUser>();

    if (!storedSession) {
      setIsLoading(false);
      return;
    }

    let active = true;

    apiFetch<{ admin: AdminUser }>('/admin/me')
      .then((response) => {
        if (!active) {
          return;
        }

        const nextSession = {
          token: storedSession.token,
          admin: response.admin,
        };

        setStoredAdminSession(nextSession);
        setSession(nextSession);
        setIsLoading(false);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        clearStoredAdminSession();
        setSession(null);
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = async (payload: AdminLoginPayload) => {
    const nextSession = await apiRequest<AdminLoginResponse>('/admin/login', {
      method: 'POST',
      body: payload,
    });

    setStoredAdminSession(nextSession);
    setSession(nextSession);
  };

  const refreshAdmin = async () => {
    const storedSession = getStoredAdminSession<AdminUser>();
    const activeToken = session?.token ?? storedSession?.token;

    if (!activeToken) {
      return;
    }

    const response = await apiFetch<{ admin: AdminUser }>('/admin/me');

    const nextSession = {
      token: activeToken,
      admin: response.admin,
    };

    setStoredAdminSession(nextSession);
    setSession(nextSession);
  };

  const logout = () => {
    clearStoredAdminSession();
    setSession(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin: session?.admin ?? null,
        token: session?.token ?? null,
        isAuthenticated: Boolean(session?.token),
        isLoading,
        login,
        refreshAdmin,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider.');
  }

  return context;
};
