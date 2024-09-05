"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = runQuery;
const mysql2_1 = __importDefault(require("mysql2"));
const appConfig_1 = require("../utils/appConfig");
const connection = mysql2_1.default.createPool({
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
                reject(err);
                return;
            }
            resolve(res);
        });
    });
}
// runQuery("select * from product").then(...).catch(...)
