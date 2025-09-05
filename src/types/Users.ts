export type AuthUser = { id: string; email: string } | null;

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
