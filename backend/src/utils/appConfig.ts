import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();
console.log("DB Environment Variables Loaded: ", process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_PORT);

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
        user: process.env.DB_USER || 'root',  // Ensure DB_USER is loaded
        password: process.env.DB_PASSWORD || '',  // Ensure DB_PASSWORD is loaded and handle empty
    };
}

class DevAppConfig extends BaseAppConfig {
    readonly port = 5000;
    readonly dbConfig: DbConfig = {
        ...this.dbConfig,
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        database: process.env.DB_NAME || 'project_vacation',
    };
}

class ProdAppConfig extends BaseAppConfig {
    readonly port = 5000;
    readonly dbConfig: DbConfig = {
        ...this.dbConfig,
        host: 'localhost', // Production host
        port: 3306,
        database: 'project_vacation', // Production database
    };
}

export const appConfig = process.env.NODE_ENV === "production"
    ? new ProdAppConfig()
    : new DevAppConfig();
