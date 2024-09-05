"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVacationRoutes = createVacationRoutes;
const express_1 = __importDefault(require("express"));
const uploadConfig_1 = require("../utils/uploadConfig");
const router = express_1.default.Router();
function createVacationRoutes(vacationController) {
    // ... other routes ...
    // Route for creating a new vacation with image upload
    router.post('/create', uploadConfig_1.upload.single('image'), vacationController.createVacation);
    // Route for updating a vacation with possible image upload
    router.put('/update/:id', uploadConfig_1.upload.single('image'), vacationController.updateVacation);
    // ... other routes ...
    return router;
}
