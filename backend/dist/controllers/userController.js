"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    constructor(userService) {
        this.userService = userService;
        this.register = async (req, res) => {
            try {
                console.log('Received request body:', req.body);
                const { firstName, lastName, email, password } = req.body;
                console.log('Destructured data:', { firstName, lastName, email });
                if (!firstName || !lastName || !email || !password) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }
                const user = await this.userService.register(firstName, lastName, email, password);
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
        };
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                // Validate user credentials
                const user = await validateUser(email, password);
                if (user) {
                    const token = generateToken(user);
                    res.json({
                        token,
                        isAdmin: user.role === 'Admin' // Assuming your user model has a 'role' field
                    });
                }
                else {
                    res.status(401).json({ error: 'Invalid credentials' });
                }
            }
            catch (error) {
                console.error('Login error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
        this.getAllUsers = async (req, res) => {
            try {
                const users = await this.userService.getAllUsers();
                res.json(users);
            }
            catch (error) {
                console.error('Error fetching users:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
    }
}
exports.UserController = UserController;
