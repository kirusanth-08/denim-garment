import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { apiFetch, apiRequest, clearStoredCustomerSession, getStoredCustomerSession, setStoredCustomerSession } from '../../lib/api';
import { Customer, CustomerProfileUpdatePayload, CustomerSession, LoginPayload, LoginResponse } from '../../features/auth/types/customer';

type AuthContextValue = {
  customer: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  refreshCustomer: () => Promise<void>;
  updateProfile: (payload: CustomerProfileUpdatePayload) => Promise<Customer>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedSession = getStoredCustomerSession<Customer>();

    if (!storedSession) {
      setIsLoading(false);
      return;
    }

    let active = true;

    apiFetch<{ customer: Customer }>('/customer/me')
      .then((response) => {
        if (!active) {
          return;
        }

        const nextSession = {
          token: storedSession.token,
          customer: response.customer,
        };

        setStoredCustomerSession(nextSession);
        setSession(nextSession);
        setIsLoading(false);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        clearStoredCustomerSession();
        setSession(null);
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = async (payload: LoginPayload) => {
    const nextSession = await apiRequest<LoginResponse>('/customer/login', {
      method: 'POST',
      body: payload,
    });

    setStoredCustomerSession(nextSession);
    setSession(nextSession);
  };

  const refreshCustomer = async () => {
    const storedSession = getStoredCustomerSession<Customer>();
    const activeToken = session?.token ?? storedSession?.token;

    if (!activeToken) {
      return;
    }

    const response = await apiFetch<{ customer: Customer }>('/customer/me');
    const nextSession = {
      token: activeToken,
      customer: response.customer,
    };

    setStoredCustomerSession(nextSession);
    setSession(nextSession);
  };

  const updateProfile = async (payload: CustomerProfileUpdatePayload) => {
    if (!session?.token) {
      throw new Error('Customer login required.');
    }

    const response = await apiRequest<{ customer: Customer }>('/customer/profile', {
      method: 'PATCH',
      body: payload,
    });

    const nextSession = {
      token: session.token,
      customer: response.customer,
    };

    setStoredCustomerSession(nextSession);
    setSession(nextSession);

    return response.customer;
  };

  const logout = () => {
    clearStoredCustomerSession();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        customer: session?.customer ?? null,
        token: session?.token ?? null,
        isAuthenticated: Boolean(session?.token),
        isLoading,
        login,
        refreshCustomer,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
};
