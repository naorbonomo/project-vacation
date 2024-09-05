// backend/src/server.ts

import express from 'express';
import cors from 'cors';
import path from 'path';
import { appConfig } from "./utils/appConfig";
import { logMW } from "./middleware/logMW";
import { isDbServerUp } from "./utils/helpers";
import { vacationRouter } from './controllers/vacationController';
import expressRateLimit from "express-rate-limit";
import catchAll from './middleware/catchAll';

const server = express();

// protect from dos attack 
server.use(expressRateLimit({
    windowMs: 1000,  // time window
    max: 50,     // amount of calls (per time window)
}))

// cors
server.use(cors({origin: ["http://localhost:3000", "http://localhost:3001"]}));
// server.use(cors({ origin: "*" })); // Development use only! Change to specific origin later


// Doorman security chcek
// server.use(doorman);

// log
server.use(logMW);

server.use(express.json());
// server.use(express.urlencoded({ extended: true }));

// // Serve static files from the uploads directory
server.use('/images', express.static(path.join(__dirname, '../uploads')));

server.use("/", vacationRouter);
server.use(catchAll);

// run server only if DB-server is active
isDbServerUp().then((isUp) => {
    if (isUp) {
        server.listen(appConfig.port, () => {
            console.log(`Listening on http://localhost:${appConfig.port}`);
        })
    } else {
        console.error("\n\n****\nDB server is not up!!!\n****\n");
    }
})


// // Check if uploads directory exists and create it if not
// const uploadsDir = path.join(__dirname, '..', 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
// }