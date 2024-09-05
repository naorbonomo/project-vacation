"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiRouter = createApiRouter;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const vacationController_1 = require("../controllers/vacationController");
function createApiRouter(userController, followController) {
    const router = express_1.default.Router();
    // Public routes
    router.post('/register', userController.register);
    router.post('/login', userController.login);
    router.get('/vacations', vacationController_1.vacationRouter);
    // User routes
    router.get('/users', auth_1.authenticate, auth_1.isAdmin, userController.getAllUsers);
    // Follow routes
    router.post('/follow', auth_1.authenticate, followController.followVacation);
    router.delete('/follow', auth_1.authenticate, followController.unfollowVacation);
    return router;
}
