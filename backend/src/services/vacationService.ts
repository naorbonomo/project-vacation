// backend/services/vacationService.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
// import { s3Client } from "../utils/s3config";
import { v4 as uuidv4 } from 'uuid';

import { ValidationError, NotFoundError } from '../models/exceptions';
import VacationModel from '../models/vacationModel';
import runQuery from '../DB/dal';
import { appConfig } from '../utils/appConfig';
import fs from 'fs';
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

export async function getAllVacations(): Promise<VacationModel[]> {
    console.log('Executing getAllVacations query');
    const q = 'SELECT * FROM vacations ORDER BY start_date ASC';
    const res = await runQuery(q);

    console.log('Query result:', res);
    return res.map((v: any) => {
        const vacation = new VacationModel(v);
        vacation.image_filename = v.image_filename ? `http://localhost:${appConfig.port}/images/${v.image_filename}` : '';//TODO change from localhost to the server address
        return vacation;
    });
}

export async function createVacation(vacationData: Partial<VacationModel>, file?: Express.Multer.File): Promise<VacationModel> {
    console.log('Received vacation data:', vacationData);
  
    const { destination, description, start_date, end_date, price } = vacationData;
  
    if (!destination) throw new ValidationError('Missing required field: destination');
    if (!description) throw new ValidationError('Missing required field: description');
    if (!start_date) throw new ValidationError('Missing required field: startDate');
    if (!end_date) throw new ValidationError('Missing required field: endDate');
    if (!price) throw new ValidationError('Missing required field: price');
  
    let imageUrl = '';
  
    if (file) {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `images/${uuidv4()}.${fileExtension}`;
  
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
  
      try {
        await s3.putObject(uploadParams).promise();
        imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`; // Fixed URL generation
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw new Error('Failed to upload image');
    }
    }
  
    console.log('Creating vacation with data:', { ...vacationData, imageUrl });
  
    const q = `
      INSERT INTO vacations (destination, description, start_date, end_date, price, image_filename)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [destination, description, start_date, end_date, price, imageUrl];
  
    try {
      const result = await runQuery(q, params) as any;
      console.log('Vacation created successfully:', result);
      return { id: result.insertId, ...vacationData, imageUrl } as VacationModel;
    } catch (error) {
      console.error('Database error:', error);
      throw new ValidationError('Failed to create vacation in database: ' + (error as Error).message);
    }
  }

export async function deleteVacation(id: number): Promise<void> {
    console.log(`Attempting to delete vacation with id: ${id}`);

    // Delete related followers first
    const deleteFollowersQuery = 'DELETE FROM followers WHERE vacation_id = ?';
    try {
        await runQuery(deleteFollowersQuery, [id]);
        console.log(`Deleted followers related to vacation_id: ${id}`);
    } catch (error) {
        console.error('Error deleting related followers:', error);
        throw new Error('Failed to delete related followers before deleting vacation');
    }

    // Now delete the vacation itself
    const q = 'DELETE FROM vacations WHERE vacation_id = ?';
    const params = [id];

    try {
        const result = await runQuery(q, params) as any;
        console.log('Delete operation result:', result);

        if (result.affectedRows === 0) {
            throw new NotFoundError(`Vacation with id ${id} not found`);
        }

        console.log(`Vacation with id ${id} deleted successfully.`);
    } catch (error) {
        console.error('Error during deletion in deleteVacation:', error);
        throw new Error(`Failed to delete vacation: ${(error as Error).message}`);
    }
}



export async function updateVacation(id: number, vacationData: Partial<VacationModel>, file?: Express.Multer.File): Promise<VacationModel> {
    console.log(`Attempting to update vacation with id: ${id}`);
    console.log('Update data received:', vacationData);
  
    // Fetch the current vacation data
    const currentVacation = await getVacationById(id);
    if (!currentVacation) {
      throw new NotFoundError(`Vacation with id ${id} not found`);
    }
  
    // Prepare update fields
    const updates: string[] = [];
    const params: any[] = [];
  
    // Helper function to add update field
    const addUpdateField = (field: keyof VacationModel, value: any) => {
      if (value !== undefined) {
        updates.push(`${field} = ?`);
        params.push(value);
      }
    };
  
    // Add fields to update
    addUpdateField('destination', vacationData.destination);
    addUpdateField('description', vacationData.description);
    addUpdateField('start_date', vacationData.start_date);
    addUpdateField('end_date', vacationData.end_date);
    addUpdateField('price', vacationData.price);
  
    // Handle image update
    if (file) {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `images/${uuidv4()}.${fileExtension}`;
  
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME as string,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
  
      try {
        await s3.putObject(uploadParams).promise();
        const newImageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
        
        // Add image_filename to update fields
        addUpdateField('image_filename', newImageUrl);
  
        // Delete old image if it exists
        if (currentVacation.image_filename) {
          const oldImageKey = currentVacation.image_filename.split('.com/')[1];
          const deleteParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME as string,
            Key: oldImageKey,
          };
          await s3.deleteObject(deleteParams).promise();
        }
      } catch (error) {
        console.error('Error handling image update:', error);
        throw new Error('Failed to update image');
      }
    }
  
    if (updates.length === 0) {
      console.log('No fields to update');
      return currentVacation;
    }
  
    const q = `
      UPDATE vacations
      SET ${updates.join(', ')}
      WHERE vacation_id = ?
    `;
    params.push(id);
  
    try {
      const result = await runQuery(q, params) as any;
      console.log('Update operation result:', result);
  
      if (result.affectedRows === 0) {
        throw new NotFoundError(`Vacation with id ${id} not found`);
      }
  
      // Fetch the updated vacation
      const updatedVacation = await getVacationById(id);
      console.log(`Vacation with id ${id} updated successfully`);
      return updatedVacation;
    } catch (error) {
      console.error('Error updating vacation:', error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to update vacation: ${(error as Error).message}`);
    }
  }
export async function getVacationById(id: number): Promise<VacationModel> {
    console.log(`Fetching vacation with id: ${id}`);

    const q = 'SELECT * FROM vacations WHERE vacation_id = ?';
    const params = [id];

    try {
        const result = await runQuery(q, params) as any[];
        
        if (result.length === 0) {
            throw new NotFoundError(`Vacation with id ${id} not found`);
        }

        console.log(`Vacation with id ${id} fetched successfully`);
        return new VacationModel(result[0]);
    } catch (error) {
        console.error('Error fetching vacation:', error);
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new Error(`Failed to fetch vacation: ${(error as Error).message}`);
    }
}

export async function getVacationsWithFollowers(): Promise<VacationModel[]> {
    console.log('Executing getVacationsWithFollowers query');
    const q = `
        SELECT v.*, COUNT(f.user_id) AS followersCount
        FROM vacations v
        LEFT JOIN followers f ON v.vacation_id = f.vacation_id
        GROUP BY v.vacation_id
        ORDER BY v.start_date ASC;
    `;
    const res = await runQuery(q);

    console.log('Query result:', res);
    return res.map((v: any) => {
        const vacation = new VacationModel(v);
        vacation.image_filename = v.image_filename ? `http://localhost:${appConfig.port}/images/${v.image_filename}` : '';// do i need it here?
        vacation.followersCount = v.followersCount; // Include followers count
        return vacation;
    });
}

