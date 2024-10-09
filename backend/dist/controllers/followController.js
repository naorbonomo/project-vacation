"use strict";
// backend/src/controllers/followController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowController = void 0;
class FollowController {
    constructor(followService) {
        this.followService = followService;
        this.followVacation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, vacationId } = req.body;
                yield this.followService.followVacation(userId, vacationId);
                res.status(201).json({ message: 'Vacation followed successfully' });
            }
            catch (error) {
                console.error('Error following vacation:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.unfollowVacation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, vacationId } = req.body;
                yield this.followService.unfollowVacation(userId, vacationId);
                res.status(200).json({ message: 'Vacation unfollowed successfully' });
            }
            catch (error) {
                console.error('Error unfollowing vacation:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.FollowController = FollowController;
