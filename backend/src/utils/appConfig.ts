import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

interface DbConfig {
    user: string | undefined;
    password: string | undefined;
    host?: string;
    port?: number;
    database?: string;
}

class BaseAppConfig {
    readonly routePrefix = "/api/v1";
    readonly errorLogFile = path.join(__dirname, "..", "logs", "error.log");
    readonly accessLogFile = path.join(__dirname, "..", "logs", "access.log");
    readonly doormanKey = process.env.DOORMAN_KEY;
    readonly jwtSecrete = process.env.JWT_SECRET;

    readonly dbConfig: DbConfig = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    };
}

class DevAppConfig extends BaseAppConfig {
    readonly port = Number(process.env.PORT) || 4002;
    readonly dbConfig: DbConfig = {
        ...this.dbConfig,
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        database: process.env.DB_NAME || 'vacation-project',
    };
}

class ProdAppConfig extends BaseAppConfig {
    readonly port = 443;
    readonly dbConfig: DbConfig = {
        ...this.dbConfig,
        host: 'aws://db:/localZone-use123123',//made up host
        port: 3306,//made up port
        database: 'vacation-project_prod',//made up database
    };
}

export const appConfig = process.env.NODE_ENV === "production"
    ? new ProdAppConfig()
    : new DevAppConfig();