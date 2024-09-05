"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeErrorLog = writeErrorLog;
exports.writeAccessLog = writeAccessLog;
const fs_1 = require("fs");
const appConfig_1 = require("./appConfig");
const path_1 = __importDefault(require("path"));
async function ensureDirectoryExists(filePath) {
    const directory = path_1.default.dirname(filePath);
    try {
        await fs_1.promises.access(directory);
    }
    catch (error) {
        await fs_1.promises.mkdir(directory, { recursive: true });
    }
}
async function writeToFile(filepath, content) {
    await ensureDirectoryExists(filepath);
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - ${content}`;
    await fs_1.promises.appendFile(filepath, logEntry + "\n");
}
async function writeErrorLog(errMsg) {
    writeToFile(appConfig_1.appConfig.errorLogFile, errMsg);
}
async function writeAccessLog(msg) {
    writeToFile(appConfig_1.appConfig.accessLogFile, msg);
}
