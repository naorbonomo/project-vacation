// backend/src/utils/appConfig.ts

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });
console.log("DB Environment Variables Loaded: ", process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);

interface DbConfig {
    user: string;
    password: string;
    host?: string;
    port?: number;
    database?: string;
}

class BaseAppConfig {
    readonly routePrefix = "/api";
    readonly errorLogFile = path.join(__dirname, "..", "logs", "error.log");
    readonly accessLogFile = path.join(__dirname, "..", "logs", "access.log");
    readonly doormanKey = process.env.DOORMAN_KEY;
    readonly jwtSecrete = process.env.JWT_SECRET || 'jwt_secret-key-or-whatever@#$%';

    readonly dbConfig: DbConfig = {
        user: process.env.DB_USER as string,   // Ensure DB_USER is loaded
        password: process.env.DB_PASSWORD as string,  // Ensure DB_PASSWORD is loaded and handle empty
    };
    readonly s3Config = {
        region: process.env.AWS_REGION || 'us-east-1',
        bucketName: process.env.AWS_S3_BUCKET_NAME || 'www.naorbonomo.com',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
}

class DevAppConfig extends BaseAppConfig {
    readonly port = process.env.PORT || 5000;
    readonly dbConfig: DbConfig = {
        ...this.dbConfig,
        host: 'localhost', // Updated to run locally on XAMPP
        user: "root", 
        password: "",  // Ensure DB_USER is loaded
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
    };
}

class ProdAppConfig extends BaseAppConfig {
    readonly port = process.env.PORT || 5000;
    readonly dbConfig: DbConfig = {
        ...this.dbConfig,
        host: process.env.DB_HOST ,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
    };
}



export const appConfig = (() => {
    switch (process.env.NODE_ENV) {
        case "production":
        case "test":
            console.log(`ENV IS : ${process.env.NODE_ENV}`)
            return new ProdAppConfig();
        case "development":
            console.log(`ENV IS : ${process.env.NODE_ENV}`)
            return new DevAppConfig();
        default:
            throw new Error(`Unknown NODE_ENV: ${process.env.NODE_ENV}`);
    }
})();
