"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    constructor(pool) {
        this.pool = pool;
    }
    register(firstName, lastName, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Registering user:', { firstName, lastName, email });
            // Check if user already exists
            const [existingUser] = yield this.pool.query('SELECT * FROM users WHERE email = ?', [email]);
            if (existingUser.length > 0) {
                console.log('User already exists:', email);
                throw new Error('User already exists');
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            try {
                const [result] = yield this.pool.query('INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)', [firstName, lastName, email, hashedPassword, 'Regular User']);
                console.log('User inserted successfully:', result);
                return { id: result.insertId, firstName, lastName, email, role: 'Regular User' };
            }
            catch (error) {
                console.error('Error inserting user:', error);
                throw error;
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Attempting login for email: ${email}`);
            const [rows] = yield this.pool.query('SELECT * FROM users WHERE email = ?', [email]);
            const user = rows[0];
            if (!user) {
                console.log('User not found');
                throw new Error('User not found');
            }
            console.log('User found, comparing passwords');
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            console.log(`Password match: ${passwordMatch}`);
            if (!passwordMatch) {
                throw new Error('Invalid password');
            }
            // Change this line
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            const token = jsonwebtoken_1.default.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
            return { user: userWithoutPassword, token };
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.query('SELECT user_id, first_name, last_name, email, role FROM users');
            return rows;
        });
    }
}
exports.UserService = UserService;
