import express from 'express';
import { vacationRouter } from '../src/controllers/vacationController';
import request from 'supertest';
import { appConfig } from '../src/utils/appConfig';
import { StatusCode } from '../src/models/statusEnum';
import { closeDB } from '../src/DB/dal';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(vacationRouter);

describe('Vacation Controller', () => {
    let vacationId: number;

    // Test to return all vacations
    it('should return all vacations', async () => {
        const res = await request(app).get(appConfig.routePrefix + "/vacations");
        expect(res.status).toBe(StatusCode.Ok);
        expect(res.body).toBeDefined();
        expect(Array.isArray(res.body)).toBe(true); // Ensure response is an array of vacations
    });

    // Test to create a new vacation
    it('should create a vacation', async () => {
        const testImagePath = path.join(__dirname, 'testImage.jpg');
        fs.writeFileSync(testImagePath, 'test image content');

        const createRes = await request(app)
            .post(appConfig.routePrefix + "/vacations")
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
        fs.unlinkSync(testImagePath);
    });

    it('should retrieve the created vacation by ID', async () => {
        const res = await request(app).get(appConfig.routePrefix + `/vacations/${vacationId}`);   
        expect(res.status).toBe(StatusCode.Ok);
        expect(res.body.id).toHaveProperty('destination', 'Hawaii'); // Adjusted to check within `id`
        expect(res.body.id).toHaveProperty('description', 'A beautiful place'); // Adjusted to check within `id`
    });
    

    it('should update the created vacation', async () => {
        const updateRes = await request(app)
            .put(appConfig.routePrefix + `/vacations/${vacationId}`)
            .field('destination', 'Updated Hawaii')
            .field('description', 'An updated description')
            .field('price', '1500')
            .field('startDate', '2023-12-05')
            .field('endDate', '2023-12-20');
    
        expect(updateRes.status).toBe(StatusCode.Ok);
        expect(updateRes.body.id).toHaveProperty('destination', 'Updated Hawaii'); // Adjusted to check within `id`
        expect(updateRes.body.id).toHaveProperty('description', 'An updated description'); // Adjusted to check within `id`
    });
    

    // Test to delete the created vacation
    it('should delete the created vacation', async () => {
        const deleteRes = await request(app).delete(appConfig.routePrefix + `/vacations/${vacationId}`);
        expect(deleteRes.status).toBe(StatusCode.NoContent);
    });

    // Test to confirm the deleted vacation no longer exists
    it('should return 404 when trying to get the deleted vacation', async () => {
        const res = await request(app).get(appConfig.routePrefix + `/vacations/${vacationId}`);
        expect(res.status).toBe(StatusCode.NotFound);
    });
});

// Close the database after all tests
afterAll(() => {
    closeDB(); // Close the DB connection after tests
});
