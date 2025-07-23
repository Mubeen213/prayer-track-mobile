export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'superAdmin',
}
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  profile_url?: string
  status: string
}
