"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiRouter = createApiRouter;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Make sure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// Add this middleware before your routes
const logRequest = (req, res, next) => {
    console.log('Received request:', {
        method: req.method,
        path: req.path,
        headers: req.headers,
        body: req.body
    });
    next();
};
function createApiRouter(vacationController, userController, followController) {
    const router = express_1.default.Router();
    router.use(logRequest); // Add this line to use the logging middleware
    // Public routes
    router.post('/register', userController.register);
    router.post('/login', userController.login);
    // Protected routes
    router.use(auth_1.authenticate);
    // Vacation routes
    router.get('/vacations', vacationController.getAllVacations);
    router.post('/vacations', auth_1.authenticate, auth_1.isAdmin, upload.single('image'), vacationController.createVacation);
    router.get('/vacations/:id', auth_1.authenticate, vacationController.getVacationById);
    router.put('/vacations/:id', auth_1.authenticate, auth_1.isAdmin, upload.single('image'), vacationController.updateVacation);
    router.delete('/vacations/:id', auth_1.authenticate, auth_1.isAdmin, vacationController.deleteVacation);
    // User routes
    router.get('/users', auth_1.isAdmin, userController.getAllUsers);
    // Follow routes
    router.post('/follow', followController.followVacation);
    router.delete('/follow', followController.unfollowVacation);
    return router;
}
