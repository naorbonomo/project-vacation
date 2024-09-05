"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
class FollowService {
    constructor(pool) {
        this.pool = pool;
    }
    async followVacation(userId, vacationId) {
        await this.pool.query('INSERT INTO followers (user_id, vacation_id) VALUES (?, ?)', [userId, vacationId]);
    }
    async unfollowVacation(userId, vacationId) {
        await this.pool.query('DELETE FROM followers WHERE user_id = ? AND vacation_id = ?', [userId, vacationId]);
    }
}
exports.FollowService = FollowService;
