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
import { authRoutes } from "./controllers/authControllers";
import { followRouter } from './controllers/followController';
import { userRouter } from './controllers/userController';
import { vacationRecommendationRouter } from './controllers/vacationRecommendationController';
import { llmRouter } from './controllers/llmController';

const server = express();

server.use(expressRateLimit({windowMs: 1000,max: 50, message: "Too many requests, you reached the limit."}))

// server.use(cors({origin: ["http://localhost:3000", "http://localhost:3001"]})); 
server.use(cors({ origin: "*" })); // Development use only! Change to specific origin later

server.use(logMW); // log

server.use(express.json()); // parse JSON

server.use('/images', express.static(path.join(__dirname, '../uploads'))); // Serve static files from the uploads directory

server.use("/", vacationRouter);
server.use("/", authRoutes)
server.use("/", followRouter); // Add followRouter to handle follow-related routes
server.use('/', userRouter);
server.use('/', vacationRecommendationRouter);
server.use("/app", llmRouter);
server.use(catchAll);
// console.log(`Listening on http://localhost:${appConfig.port}`);

isDbServerUp().then((isUp) => { // run server only if DB-server is active
    if (isUp) {
        server.listen(appConfig.port, () => {
        })
        console.log(`Listening on ${appConfig.dbConfig.host}:${appConfig.port}`);
    } else {console.error("\n\n****\nDB server is not up!!!\n****\n");}
})
 