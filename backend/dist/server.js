"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const promise_1 = __importDefault(require("mysql2/promise"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const appConfig_1 = require("./utils/appConfig");
const api_1 = require("./routes/api");
const vacationService_1 = require("./services/vacationService");
const vacationController_1 = require("./controllers/vacationController");
const userService_1 = require("./services/userService");
const userController_1 = require("./controllers/userController");
const followService_1 = require("./services/followService");
const followController_1 = require("./controllers/followController");
const app = (0, express_1.default)();
// Add these lines before your routes
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Enable CORS for all routes
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // or whatever port your frontend is running on
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));
// Set up multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// Create a MySQL connection pool
const pool = promise_1.default.createPool(appConfig_1.appConfig.dbConfig);
// Initialize services and controllers
const vacationService = new vacationService_1.VacationService(pool);
const vacationController = new vacationController_1.VacationController(vacationService);
const userService = new userService_1.UserService(pool);
const userController = new userController_1.UserController(userService);
const followService = new followService_1.FollowService(pool);
const followController = new followController_1.FollowController(followService);
// Serve static files from the uploads directory
app.use('/images', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Set up API routes
const apiRouter = (0, api_1.createApiRouter)(vacationController, userController, followController);
app.use('/api', apiRouter);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});
// Check if uploads directory exists and create it if not
const uploadsDir = path_1.default.join(__dirname, '..', 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Make sure this line is present to parse JSON bodies
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.listen(appConfig_1.appConfig.port, () => {
    console.log(`Server running on port ${appConfig_1.appConfig.port}`);
});
