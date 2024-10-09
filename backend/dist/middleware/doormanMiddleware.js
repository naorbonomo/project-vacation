"use strict";
// backend/src/middleware/doormanMiddleware.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.doorman = doorman;
const appConfig_1 = require("../utils/appConfig");
const exceptions_1 = require("../models/exceptions");
function doorman(req, res, next) {
    if (req.header("doormanKey") !== appConfig_1.appConfig.doormanKey)
        next(new exceptions_1.UnauthorizedError("DBG: Doorman"));
    next();
}
