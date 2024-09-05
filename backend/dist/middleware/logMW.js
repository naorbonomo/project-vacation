"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMW = logMW;
const logger_1 = require("../utils/logger");
async function logMW(req, res, next) {
    (0, logger_1.writeAccessLog)(`New ${req.method} to: ${req.url}`);
    next();
}
