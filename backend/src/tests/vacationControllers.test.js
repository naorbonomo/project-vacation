"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vacationController_1 = require("../src/controllers/vacationController");
const supertest_1 = __importDefault(require("supertest"));
const appConfig_1 = require("../src/utils/appConfig");
const statusEnum_1 = require("../src/models/statusEnum");
const dal_1 = require("../src/DB/dal");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(vacationController_1.vacationRouter);
describe('Vacation Controller', () => {
    let vacationId;
    // Test to return all vacations
    it('should return all vacations', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get(appConfig_1.appConfig.routePrefix + "/vacations");
        expect(res.status).toBe(statusEnum_1.StatusCode.Ok);
        expect(res.body).toBeDefined();
        expect(Array.isArray(res.body)).toBe(true); // Ensure response is an array of vacations
    }));
    // Test to create a new vacation
    it('should create a vacation', () => __awaiter(void 0, void 0, void 0, function* () {
        const testImagePath = path_1.default.join(__dirname, 'testImage.jpg');
        fs_1.default.writeFileSync(testImagePath, 'test image content');
        const createRes = yield (0, supertest_1.default)(app)
            .post(appConfig_1.appConfig.routePrefix + "/vacations")
            .field('destination', 'Hawaii')
            .field('description', 'A beautiful place')
            .field('price', '1000')
            .field('startDate', '2023-12-01')
            .field('endDate', '2023-12-15')
            .attach('image', testImagePath);
        expect(createRes.status).toBe(201);
        expect(createRes.body).toHaveProperty('vacation');
        vacationId = createRes.body.vacation.id; // Store the vacation ID for further operations
        expect(vacationId).toBeDefined();
        // Clean up the test image
        fs_1.default.unlinkSync(testImagePath);
    }));
    it('should retrieve the created vacation by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get(appConfig_1.appConfig.routePrefix + `/vacations/${vacationId}`);
        expect(res.status).toBe(statusEnum_1.StatusCode.Ok);
        expect(res.body.id).toHaveProperty('destination', 'Hawaii'); // Adjusted to check within `id`
        expect(res.body.id).toHaveProperty('description', 'A beautiful place'); // Adjusted to check within `id`
    }));
    it('should update the created vacation', () => __awaiter(void 0, void 0, void 0, function* () {
        const updateRes = yield (0, supertest_1.default)(app)
            .put(appConfig_1.appConfig.routePrefix + `/vacations/${vacationId}`)
            .field('destination', 'Updated Hawaii')
            .field('description', 'An updated description')
            .field('price', '1500')
            .field('startDate', '2023-12-05')
            .field('endDate', '2023-12-20');
        expect(updateRes.status).toBe(statusEnum_1.StatusCode.Ok);
        expect(updateRes.body.id).toHaveProperty('destination', 'Updated Hawaii'); // Adjusted to check within `id`
        expect(updateRes.body.id).toHaveProperty('description', 'An updated description'); // Adjusted to check within `id`
    }));
    // Test to delete the created vacation
    it('should delete the created vacation', () => __awaiter(void 0, void 0, void 0, function* () {
        const deleteRes = yield (0, supertest_1.default)(app).delete(appConfig_1.appConfig.routePrefix + `/vacations/${vacationId}`);
        expect(deleteRes.status).toBe(statusEnum_1.StatusCode.NoContent);
    }));
    // Test to confirm the deleted vacation no longer exists
    it('should return 404 when trying to get the deleted vacation', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get(appConfig_1.appConfig.routePrefix + `/vacations/${vacationId}`);
        expect(res.status).toBe(statusEnum_1.StatusCode.NotFound);
    }));
});
// Close the database after all tests
afterAll(() => {
    (0, dal_1.closeDB)(); // Close the DB connection after tests
});
