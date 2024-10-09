"use strict";
// backend/src/utils/logger.ts
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
exports.writeErrorLog = writeErrorLog;
exports.writeAccessLog = writeAccessLog;
const fs_1 = require("fs");
const appConfig_1 = require("./appConfig");
const path_1 = __importDefault(require("path"));
function ensureDirectoryExists(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const directory = path_1.default.dirname(filePath);
        try {
            yield fs_1.promises.access(directory);
        }
        catch (error) {
            yield fs_1.promises.mkdir(directory, { recursive: true });
        }
    });
}
function writeToFile(filepath, content) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ensureDirectoryExists(filepath);
        const timestamp = new Date().toISOString();
        const logEntry = `${timestamp} - ${content}`;
        yield fs_1.promises.appendFile(filepath, logEntry + "\n");
    });
}
function writeErrorLog(errMsg) {
    return __awaiter(this, void 0, void 0, function* () {
        writeToFile(appConfig_1.appConfig.errorLogFile, errMsg);
    });
}
function writeAccessLog(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        writeToFile(appConfig_1.appConfig.accessLogFile, msg);
    });
}
