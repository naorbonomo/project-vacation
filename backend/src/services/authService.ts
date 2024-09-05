// backend/src/services/authService.ts

import runQuery from "../DB/dal";
import { UnauthorizedError } from "../models/exceptions";
import UserModel from "../models/userModel";
import { createToken } from "../utils/authUtils";

export async function createUser(user:UserModel) {
    
    user.validate();

    let q = `INSERT INTO users ( first_name, last_name, email, password) 
            values ('${user.first_name}', '${user.last_name}', '${user.email}','${user.password}');`;

    await runQuery(q);

    q = `SELECT user_id FROM users WHERE email='${user.email}';`;
    const res = await runQuery(q);
    const id = res[0].id;
    user.id = id;

    user.token = createToken(user);

    q = `UPDATE users SET token='${user.token}' WHERE user_id=${user.id};`;
    await runQuery(q)

    return user.token;
}

export async function login(email:string, password: string) {
    let q = `SELECT * FROM users WHERE email=? AND password=?;`;
    const params = [email, password]    
    
    const res = await runQuery(q, params);

    if (res.length === 0){
        throw new UnauthorizedError("wrong credentials");
    }

    const user = new UserModel(res[0]);
    if (!user.token){
        user.token = createToken(user);
        q = `UPDATE users SET token='${user.token}' WHERE user_id=${user.id};`;
        await runQuery(q)
    }

    return user.token;    
}