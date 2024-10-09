// backend/services/followService.ts
import runQuery from '../DB/dal';
import FollowModel from '../models/followModel';

export class FollowService {
    async followVacation(followData: FollowModel): Promise<void> {
        await runQuery(
            'INSERT INTO followers (user_id, vacation_id) VALUES (?, ?)',
            [followData.userId, followData.vacationId]
        );
    }

    async unfollowVacation(followData: FollowModel): Promise<void> {
        await runQuery(
            'DELETE FROM followers WHERE user_id = ? AND vacation_id = ?',
            [followData.userId, followData.vacationId]
        );
    }

    async getFollowedVacations(userId: number): Promise<number[]> {
        const [rows] = await runQuery(
            'SELECT vacation_id FROM followers WHERE user_id = ?',
            [userId]
        );
        return rows.map((row: any) => row.vacation_id);
    }
}
