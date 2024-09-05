"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenMW = verifyTokenMW;
exports.verifyTokenAdminMW = verifyTokenAdminMW;
const authUtils_1 = require("../utils/authUtils");
function verifyTokenMW(req, res, next) {
    try {
        const token = req.header("Authorization")?.substring(7) || "";
        const user = (0, authUtils_1.verifyToken)(token);
        res.locals.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
}
function verifyTokenAdminMW(req, res, next) {
    try {
        const token = req.header("Authorization")?.substring(7) || "";
        const user = (0, authUtils_1.verifyToken)(token, true);
        res.locals.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
}
