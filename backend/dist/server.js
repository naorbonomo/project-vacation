"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const appConfig_1 = require("./utils/appConfig");
const logMW_1 = require("./middleware/logMW");
const helpers_1 = require("./utils/helpers");
const vacationController_1 = require("./controllers/vacationController");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const server = (0, express_1.default)();
// protect from dos attack 
server.use((0, express_rate_limit_1.default)({
    windowMs: 1000, // time window
    max: 2, // amount of calls (per time window)
}));
// cors
server.use((0, cors_1.default)({ origin: ["http://localhost:3000", "http://localhost:3001"] }));
// Doorman security chcek
// server.use(doorman);
// log
server.use(logMW_1.logMW);
server.use(express_1.default.json());
// server.use(express.urlencoded({ extended: true }));
// Serve static files from the uploads directory
server.use('/images', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Add vacation router
server.use('/api', vacationController_1.vacationRouter);
// Error handling middleware
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});
// run server only if DB-server is active
(0, helpers_1.isDbServerUp)().then((isUp) => {
    if (isUp) {
        server.listen(appConfig_1.appConfig.port, () => {
            console.log(`Listening on http://localhost:${appConfig_1.appConfig.port}`);
        });
    }
    else {
        console.error("\n\n****\nDB server is not up!!!\n****\n");
    }
});
// // Check if uploads directory exists and create it if not
// const uploadsDir = path.join(__dirname, '..', 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
// }
