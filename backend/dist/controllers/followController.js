"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowController = void 0;
class FollowController {
    constructor(followService) {
        this.followService = followService;
        this.followVacation = async (req, res) => {
            try {
                const { userId, vacationId } = req.body;
                await this.followService.followVacation(userId, vacationId);
                res.status(201).json({ message: 'Vacation followed successfully' });
            }
            catch (error) {
                console.error('Error following vacation:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
        this.unfollowVacation = async (req, res) => {
            try {
                const { userId, vacationId } = req.body;
                await this.followService.unfollowVacation(userId, vacationId);
                res.status(200).json({ message: 'Vacation unfollowed successfully' });
            }
            catch (error) {
                console.error('Error unfollowing vacation:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
    }
}
exports.FollowController = FollowController;
