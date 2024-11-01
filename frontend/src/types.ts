export interface User {
  name: string;
  lastname: string;
  role: 'Admin' | 'Regular User';
  user_id: number;
  email: string;
}