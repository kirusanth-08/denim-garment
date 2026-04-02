export type AdminRole = 'admin' | 'inventory_manager';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleLabel: string;
  title: string;
};

export type AdminSession = {
  token: string;
  admin: AdminUser;
};

export type AdminLoginPayload = {
  email: string;
  password: string;
};

export type AdminLoginResponse = AdminSession;
