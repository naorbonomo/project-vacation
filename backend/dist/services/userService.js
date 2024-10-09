"use strict";
// backend/src/services/userService.ts
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
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const authUtils_1 = require("../utils/authUtils");
const exceptions_1 = require("../models/exceptions");
const userModel_1 = __importDefault(require("../models/userModel"));
const dal_1 = __importDefault(require("../DB/dal"));
class UserService {
    constructor(pool) {
        this.pool = pool;
    }
    register(firstName, lastName, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Registering user:', { firstName, lastName, email });
            // Check if user already exists
            const q = 'SELECT * FROM users WHERE email = ?';
            const existingUser = yield (0, dal_1.default)(q, [email]);
            if (existingUser.length > 0) {
                console.log('User already exists:', email);
                throw new exceptions_1.ValidationError('User already exists');
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const insertQuery = `
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `;
            const params = [firstName, lastName, email, hashedPassword, 'Regular User'];
            try {
                const result = yield (0, dal_1.default)(insertQuery, params);
                console.log('User inserted successfully:', result);
                return new userModel_1.default({
                    id: result.insertId,
                    first_name: result.firstName, // Changed from first_name to firstName
                    last_name: result.lastName,
                    email,
                    role: 'Regular User',
                    isAdmin: false,
                    token: ''
                });
            }
            catch (error) {
                console.error('Error inserting user:', error);
                throw new exceptions_1.ValidationError('Failed to register user');
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Attempting login for email: ${email}`);
            const q = 'SELECT * FROM users WHERE email = ?';
            const res = yield (0, dal_1.default)(q, [email]);
            const user = res.length ? new userModel_1.default(res[0]) : null;
            if (!user) {
                console.log('User not found');
                throw new exceptions_1.UnauthorizedError('User not found');
            }
            console.log('User found, comparing passwords');
            if (!user.password) {
                throw new exceptions_1.UnauthorizedError('Invalid user data');
            }
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                throw new exceptions_1.UnauthorizedError('Invalid password');
            }
            const token = (0, authUtils_1.createToken)(user);
            console.log('Generated token:', token);
            user.password = undefined; // Remove password before returning the user object
            return { user, token };
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const q = 'SELECT user_id, first_name, last_name, email, role FROM users';
            const res = yield (0, dal_1.default)(q);
            return res.map((u) => new userModel_1.default(u));
        });
    }
}
exports.UserService = UserService;
