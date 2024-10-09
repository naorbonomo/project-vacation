// backend/src/services/userService.ts

import bcrypt from 'bcrypt';
import { createToken } from '../utils/authUtils';
import { ValidationError, UnauthorizedError } from '../models/exceptions';
import UserModel from '../models/userModel';
import runQuery from '../DB/dal';
import { Pool } from 'mysql2/promise';

export class UserService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async register(firstName: string, lastName: string, email: string, password: string): Promise<UserModel> {
    console.log('Registering user:', { firstName, lastName, email });

    // Check if user already exists
    const q = 'SELECT * FROM users WHERE email = ?';
    const existingUser = await runQuery(q, [email]);

    if (existingUser.length > 0) {
      console.log('User already exists:', email);
      throw new ValidationError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [firstName, lastName, email, hashedPassword, 'Regular User'];

    try {
      const result = await runQuery(insertQuery, params) as any;
      console.log('User inserted successfully:', result);
      return new UserModel({
        id: result.insertId,
        first_name: result.firstName, // Changed from first_name to firstName
        last_name: result.lastName,
        email,
        role: 'Regular User',
        isAdmin: false,
        token: ''
      });
    } catch (error) {
      console.error('Error inserting user:', error);
      throw new ValidationError('Failed to register user');
    }
  }

  async login(email: string, password: string): Promise<{ user: UserModel, token: string }> {
    console.log(`Attempting login for email: ${email}`);

    const q = 'SELECT * FROM users WHERE email = ?';
    const res = await runQuery(q, [email]);
    const user = res.length ? new UserModel(res[0]) : null;

    if (!user) {
      console.log('User not found');
      throw new UnauthorizedError('User not found');
    }

    console.log('User found, comparing passwords');
    if (!user.password) {
      throw new UnauthorizedError('Invalid user data');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid password');
    }

    const token = createToken(user);
    console.log('Generated token:', token);
    user.password = undefined; // Remove password before returning the user object

    return { user, token };
  }

  async getAllUsers(): Promise<UserModel[]> {
    const q = 'SELECT user_id, first_name, last_name, email, role FROM users';
    const res = await runQuery(q);

    return res.map((u: any) => new UserModel(u));
  }


}

export async function getUserIdByEmail(email: string): Promise<number | null> {
    console.log("getUserIdByEmail SQL - searching for user with email:", email);

    const query = 'SELECT user_id FROM users WHERE email = ?';
    try {
        const result = await runQuery(query, [email]);
        console.log("SQL Query Result:", result);

        // Assuming result is an array of rows, extract the first row
        const rows = Array.isArray(result) ? result : result[0];
        
        if (rows && rows.length > 0 && rows[0].user_id) {
            console.log("User found with ID:", rows[0].user_id);
            return rows[0].user_id;
        } else {
            console.log("No user found with the provided email.");
            return null;
        }
    } catch (error) {
        console.error("Error during SQL query in getUserIdByEmail:", error);
        throw error;
    }
}

