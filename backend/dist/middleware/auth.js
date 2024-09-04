"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    console.log('Headers:', req.headers); // Log all headers
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log('Received token:', token); // Log the received token
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
            if (err) {
                console.error('Token verification error:', err); // Log the verification error
                return res.sendStatus(403);
            }
            console.log('Decoded token:', user);
            req.user = user;
            next();
        });
    }
    else {
        console.log('No authorization header present');
        res.sendStatus(401);
    }
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
