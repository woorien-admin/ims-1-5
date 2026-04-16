export const UserRole = {
  ADMIN: 'ADMIN',
  COUNSELOR: 'COUNSELOR',
  EXTERNAL_COUNSELOR: 'EXTERNAL_COUNSELOR',
  UNREGISTERED: 'UNREGISTERED',
  RESIGNED: 'RESIGNED',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

