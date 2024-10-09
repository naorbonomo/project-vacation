// backend/src/DB/dal.ts

import mysql from "mysql2";
import { appConfig } from "../utils/appConfig";
import dotenv from 'dotenv';

dotenv.config();

console.log('Database configuration:', appConfig.dbConfig);

const connection = mysql.createPool({
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_PORT,
    // port: Number(process.env.DB_PORT)
    host: appConfig.dbConfig.host,
    user: appConfig.dbConfig.user,
    password: appConfig.dbConfig.password,
    database: appConfig.dbConfig.database,
    port: appConfig.dbConfig.port
});

// Function to run an SQL query
export default function runQuery(q: string, params: any[]=[]): Promise<any[]> {
    return new Promise((resolve, reject) => {

        connection.query(q, params, (err, res) => {
            if (err) {
                console.error("Database query error:", err);  // Log query error

                reject(err);
                return;
            }
            resolve(res as any[]);
        })
    });
}

// runQuery("select * from product").then(...).catch(...)
export const closeDB = async () =>{
    connection.end()
}