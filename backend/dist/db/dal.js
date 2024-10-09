"use strict";
// backend/src/DB/dal.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDB = void 0;
exports.default = runQuery;
const mysql2_1 = __importDefault(require("mysql2"));
const appConfig_1 = require("../utils/appConfig");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('Database configuration:', appConfig_1.appConfig.dbConfig);
const connection = mysql2_1.default.createPool({
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_PORT,
    // port: Number(process.env.DB_PORT)
    host: appConfig_1.appConfig.dbConfig.host,
    user: appConfig_1.appConfig.dbConfig.user,
    password: appConfig_1.appConfig.dbConfig.password,
    database: appConfig_1.appConfig.dbConfig.database,
    port: appConfig_1.appConfig.dbConfig.port
});
// Function to run an SQL query
function runQuery(q, params = []) {
    return new Promise((resolve, reject) => {
        connection.query(q, params, (err, res) => {
            if (err) {
                console.error("Database query error:", err); // Log query error
                reject(err);
                return;
            }
            resolve(res);
        });
    });
}
// runQuery("select * from product").then(...).catch(...)
const closeDB = () => __awaiter(void 0, void 0, void 0, function* () {
    connection.end();
});
exports.closeDB = closeDB;
