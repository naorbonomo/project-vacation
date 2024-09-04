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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    constructor(userService) {
        this.userService = userService;
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Received request body:', req.body);
                const { firstName, lastName, email, password } = req.body;
                console.log('Destructured data:', { firstName, lastName, email });
                if (!firstName || !lastName || !email || !password) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }
                const user = yield this.userService.register(firstName, lastName, email, password);
                console.log('User registered successfully:', user);
                res.status(201).json(user);
            }
            catch (error) {
                console.error('Error in register controller:', error);
                if (error instanceof Error) {
                    if (error.message === 'User already exists') {
                        res.status(409).json({ error: 'User already exists' });
                    }
                    else {
                        console.error('Unexpected error:', error.stack);
                        res.status(500).json({ error: 'Internal server error', details: error.message });
                    }
                }
                else {
                    console.error('Unknown error:', error);
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.userService.login(email, password);
                res.json(result);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === 'User not found') {
                        res.status(404).json({ error: 'User not found' });
                    }
                    else if (error.message === 'Invalid password') {
                        res.status(401).json({ error: 'Invalid password' });
                    }
                    else {
                        console.error('Error logging in:', error);
                        res.status(500).json({ error: 'Internal server error' });
                    }
                }
            }
        });
        this.getAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userService.getAllUsers();
                res.json(users);
            }
            catch (error) {
                console.error('Error fetching users:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.UserController = UserController;
