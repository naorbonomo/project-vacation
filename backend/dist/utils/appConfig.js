"use strict";
// backend/src/utils/appConfig.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '.env') });
console.log("DB Environment Variables Loaded: ", process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);
class BaseAppConfig {
    constructor() {
        this.routePrefix = "/api";
        this.errorLogFile = path_1.default.join(__dirname, "..", "logs", "error.log");
        this.accessLogFile = path_1.default.join(__dirname, "..", "logs", "access.log");
        this.doormanKey = process.env.DOORMAN_KEY;
        this.jwtSecrete = process.env.JWT_SECRET || 'jwt_secret-key-or-whatever@#$%';
        this.dbConfig = {
            user: process.env.DB_USER, // Ensure DB_USER is loaded
            password: process.env.DB_PASSWORD, // Ensure DB_PASSWORD is loaded and handle empty
        };
        this.s3Config = {
            region: process.env.AWS_REGION || 'us-east-1',
            bucketName: process.env.AWS_S3_BUCKET_NAME || 'project-vacation',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        };
    }
}
class DevAppConfig extends BaseAppConfig {
    constructor() {
        super(...arguments);
        this.port = process.env.PORT || 5000;
        this.dbConfig = Object.assign(Object.assign({}, this.dbConfig), { host: 'localhost', user: "root", password: "", port: Number(process.env.DB_PORT), database: process.env.DB_NAME });
    }
}
class ProdAppConfig extends BaseAppConfig {
    constructor() {
        super(...arguments);
        this.port = process.env.PORT || 5000;
        this.dbConfig = Object.assign(Object.assign({}, this.dbConfig), { host: process.env.DB_HOST, port: Number(process.env.DB_PORT), database: process.env.DB_NAME });
    }
}
exports.appConfig = (() => {
    switch (process.env.NODE_ENV) {
        case "production":
            console.log(`ENV IS : ${process.env.NODE_ENV}`);
            return new ProdAppConfig();
        case "development":
            console.log(`ENV IS : ${process.env.NODE_ENV}`);
            return new DevAppConfig();
        default:
            throw new Error(`Unknown NODE_ENV: ${process.env.NODE_ENV}`);
    }
})();
