import fs from 'fs';
import path from 'path';

export const logInteraction = (userInput: string, result: any, identifier: string, provider: string) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        provider,
        identifier,
        userInput,
        result
    };

    // Log to console
    console.log('Interaction:', logEntry);

    // Log to file
    const logDir = path.join(__dirname, '..', '..', 'logs');
    const logFile = path.join(logDir, 'interactions.log');

    // Ensure log directory exists
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    // Append to log file
    fs.appendFileSync(
        logFile,
        JSON.stringify(logEntry) + '\n',
        'utf8'
    );
}; 