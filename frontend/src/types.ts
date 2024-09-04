export interface User {
  name: string;
  role: 'Admin' | 'Regular User';
  user_id: number;
  email: string;
}