"use strict";
// backend/src/server.ts
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
const catchAll_1 = __importDefault(require("./middleware/catchAll"));
const authControllers_1 = require("./controllers/authControllers");
const server = (0, express_1.default)();
server.use((0, express_rate_limit_1.default)({ windowMs: 1000, max: 50, message: "Too many requests, you reached the limit." }));
// server.use(cors({origin: ["http://localhost:3000", "http://localhost:3001"]})); 
server.use((0, cors_1.default)({ origin: "*" })); // Development use only! Change to specific origin later
server.use(logMW_1.logMW); // log
server.use(express_1.default.json()); // parse JSON
server.use('/images', express_1.default.static(path_1.default.join(__dirname, '../uploads'))); // Serve static files from the uploads directory
server.use("/", vacationController_1.vacationRouter);
server.use("/", authControllers_1.authRoutes);
server.use(catchAll_1.default);
// console.log(`Listening on http://localhost:${appConfig.port}`);
(0, helpers_1.isDbServerUp)().then((isUp) => {
    if (isUp) {
        server.listen(appConfig_1.appConfig.port, () => {
        });
        console.log(`Listening on ${appConfig_1.appConfig.dbConfig.host}:${appConfig_1.appConfig.port}`);
    }
    else {
        console.error("\n\n****\nDB server is not up!!!\n****\n");
    }
});
