// backend/src/services/authService.ts

import runQuery from "../DB/dal";
import { UnauthorizedError } from "../models/exceptions";
import UserModel from "../models/userModel";
import { createToken, encryptPassword, validatePassword } from "../utils/authUtils";

export async function createUser(user: UserModel) {
    user.validate();

    const hashedPassword = await encryptPassword(user.password as string);
    // user.password = hashedPassword;
    let q = `INSERT INTO users (first_name, last_name, email, password) 
             VALUES (?, ?, ?, ?);`;
    const params = [user.first_name, user.last_name, user.email, hashedPassword];

    await runQuery(q, params);

    q = `SELECT user_id FROM users WHERE email=?;`;
    const res = await runQuery(q, [user.email]);
    const id = res[0].id;
    user.id = id;

    user.token = createToken(user);

    q = `UPDATE users SET token=? WHERE user_id=?;`;
    await runQuery(q, [user.token, user.id]);

    return user.token;
}

export async function login(email: string, password: string) {
    let q = `SELECT * FROM users WHERE email=?;`;
    const res = await runQuery(q, [email]);

    if (res.length === 0 || !(await validatePassword(password, res[0].password))) {
        throw new UnauthorizedError("Wrong credentials");
    }
    const user = new UserModel(res[0]);

    if (!user.token) {
        user.token = createToken(user);
        q = `UPDATE users SET token=? WHERE user_id=?;`;
        await runQuery(q, [user.token, user.id]);
    }
    return user.token;
}