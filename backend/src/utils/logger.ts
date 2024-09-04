import { promises as fs } from "fs";
import { appConfig } from "./appConfig";
import path from "path";

async function ensureDirectoryExists(filePath: string) {
    const directory = path.dirname(filePath);
    try {
        await fs.access(directory);
    } catch (error) {
        await fs.mkdir(directory, { recursive: true });
    }
}

async function writeToFile(filepath: string, content: string) {
    await ensureDirectoryExists(filepath);
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - ${content}`;
    await fs.appendFile(filepath, logEntry + "\n");
}

export async function writeErrorLog(errMsg: string) {    
    writeToFile(appConfig.errorLogFile, errMsg);
}

export async function writeAccessLog(msg: string) {
    writeToFile(appConfig.accessLogFile, msg);
}
