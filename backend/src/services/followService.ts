import { Pool } from 'mysql2/promise';

export class FollowService {
  constructor(private pool: Pool) {}

  async followVacation(userId: number, vacationId: number) {
    await this.pool.query(
      'INSERT INTO followers (user_id, vacation_id) VALUES (?, ?)',
      [userId, vacationId]
    );
  }

  async unfollowVacation(userId: number, vacationId: number) {
    await this.pool.query(
      'DELETE FROM followers WHERE user_id = ? AND vacation_id = ?',
      [userId, vacationId]
    );
  }
}