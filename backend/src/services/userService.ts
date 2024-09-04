import { Pool } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { createToken } from '../utils/authUtils'; // Import createToken
import jwt from 'jsonwebtoken';

export class UserService {
  constructor(private pool: Pool) {}

  async register(firstName: string, lastName: string, email: string, password: string) {
    console.log('Registering user:', { firstName, lastName, email });
    // Check if user already exists
    const [existingUser] = await this.pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if ((existingUser as any[]).length > 0) {
      console.log('User already exists:', email);
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const [result] = await this.pool.query(
        'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [firstName, lastName, email, hashedPassword, 'Regular User']
      );
      console.log('User inserted successfully:', result);
      return { id: (result as any).insertId, firstName, lastName, email, role: 'Regular User' };
    } catch (error) {
      console.error('Error inserting user:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    console.log(`Attempting login for email: ${email}`);
    const [rows] = await this.pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = (rows as any[])[0];
    if (!user) {
      console.log('User not found');
      throw new Error('User not found');
    }
    console.log('User found:', user);
    console.log('User found, comparing passwords');
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match: ${passwordMatch}`);
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }
    const { password: _, ...userWithoutPassword } = user;
    console.log('User without password:', userWithoutPassword);
    const token = createToken(userWithoutPassword); // Use createToken from authUtils
    console.log('Generated token:', token);
    return { user: userWithoutPassword, token };
  }

  async getAllUsers() {
    const [rows] = await this.pool.query('SELECT user_id, first_name, last_name, email, role FROM users');
    return rows;
  }
}