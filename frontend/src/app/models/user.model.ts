export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  MAINTENANCE = 'maintenance',
}

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  role: UserRole;
}

export function getUserRoleLabel(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return 'Administrador';
    case UserRole.OPERATOR:
      return 'Operador';
    case UserRole.MAINTENANCE:
      return 'Mantenimiento';
  }
}
