// backend/services/followService.ts
import runQuery from '../DB/dal';
import FollowModel from '../models/followModel';

export class FollowService {
    async followVacation(followData: FollowModel): Promise<void> {
        try {
            await runQuery(
                'INSERT IGNORE INTO followers (user_id, vacation_id) VALUES (?, ?)',
                [followData.user_id, followData.vacation_id]
            );
        } catch (error) {
            if (error === 'ER_DUP_ENTRY') {
                console.log('User already follows this vacation');
                // You might want to return a specific message or status here
            } else {
                console.error('Error following vacation:', error);
                throw error;
            }
        }
    }

    async unfollowVacation(followData: FollowModel): Promise<void> {
        await runQuery(
            'DELETE FROM followers WHERE user_id = ? AND vacation_id = ?',
            [followData.user_id, followData.vacation_id]
        );
    }

    // async getFollowedVacations(userId: number): Promise<number[]> {
    //     const [rows] = await runQuery(
    //         'SELECT vacation_id FROM followers WHERE user_id = ?',
    //         [userId]
    //     );
    //     return rows.map((row: any) => row.vacation_id);
    // }
    
    async getFollowedVacations(userId: number): Promise<number[]> {
        try {
            const query = `
                SELECT GROUP_CONCAT(vacation_id) as vacation_ids
                FROM followers
                WHERE user_id = ?
            `;
            
            const [result] = await runQuery(query, [userId]);
            
            console.log('Raw query result:', result);
    
            if (!result || !result.vacation_ids) {
                console.log('No followed vacations found');
                return [];
            }
    
            const vacationIds = result.vacation_ids.split(',').map(Number);
            console.log('Processed vacation IDs:', vacationIds);
    
            return vacationIds;
        } catch (error) {
            console.error('Error in getFollowedVacations:', error);
            throw error;
        }
    }
}
