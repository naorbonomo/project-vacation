"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appConfig_1 = require("../utils/appConfig");
const authenticate = (req, res, next) => {
    console.log('Entire request:', req);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, appConfig_1.appConfig.jwtSecrete, (err, user) => {
        console.log('Token verification result:', err ? 'Error' : 'Success');
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
};
exports.authenticate = authenticate;
const isAdmin = (req, res, next) => {
    console.log('User in isAdmin middleware:', req.user);
    if (req.user && req.user.role === 'Admin') {
        next();
    }
    else {
        console.log('Access denied: User is not an admin');
        res.status(403).json({ error: 'Access denied. Admin rights required.' });
    }
};
exports.isAdmin = isAdmin;
