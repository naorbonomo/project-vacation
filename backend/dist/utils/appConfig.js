"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config();
class BaseAppConfig {
    constructor() {
        this.routePrefix = "/api";
        this.errorLogFile = path_1.default.join(__dirname, "..", "logs", "error.log");
        this.accessLogFile = path_1.default.join(__dirname, "..", "logs", "access.log");
        this.doormanKey = process.env.DOORMAN_KEY;
        this.jwtSecrete = process.env.JWT_SECRET;
        this.dbConfig = {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        };
    }
}
class DevAppConfig extends BaseAppConfig {
    constructor() {
        super(...arguments);
        this.port = Number(process.env.PORT) || 4002;
        this.dbConfig = {
            ...this.dbConfig,
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 3306,
            database: process.env.DB_NAME || 'project_vacation',
        };
    }
}
class ProdAppConfig extends BaseAppConfig {
    constructor() {
        super(...arguments);
        this.port = 443;
        this.dbConfig = {
            ...this.dbConfig,
            host: 'aws://db:/localZone-use123123', //made up host
            port: 3306, //made up port
            database: 'project_vacation', //made up database
        };
    }
}
exports.appConfig = process.env.NODE_ENV === "production"
    ? new ProdAppConfig()
    : new DevAppConfig();
