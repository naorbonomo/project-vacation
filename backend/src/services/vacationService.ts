import { Pool } from 'mysql2/promise';

export class VacationService {
  constructor(private pool: Pool) {}

  async getAllVacations() {
    console.log('Executing getAllVacations query');
    const [rows] = await this.pool.query('SELECT * FROM vacations ORDER BY start_date ASC');
    console.log('Query result:', rows);
    return rows;
  }

  async createVacation(vacationData: any) {
    const { destination, description, startDate, endDate, price, imageFilename } = vacationData;
    
    console.log('Creating vacation with data:', vacationData);

    if (!destination || !description || !startDate || !endDate || !price) {
      throw new Error('Missing required fields');
    }

    try {
      const [result] = await this.pool.query(
        'INSERT INTO vacations (destination, description, start_date, end_date, price, image_filename) VALUES (?, ?, ?, ?, ?, ?)',
        [destination, description, startDate, endDate, price, imageFilename]
      );
      console.log('Vacation created successfully:', result);
      return { id: (result as any).insertId, ...vacationData };
    } catch (error) {
      console.error('Database error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create vacation in database: ${error.message}`);
      } else {
        throw new Error('Failed to create vacation in database');
      }
    }
  }

  async updateVacation(id: number, vacationData: any, image: Express.Multer.File | undefined) {
    const { destination, description, start_date, end_date, price } = vacationData;
    let image_filename = undefined;

    if (image) {
      image_filename = image.filename;
    }

    const [result] = await this.pool.query(
      'UPDATE vacations SET destination = ?, description = ?, start_date = ?, end_date = ?, price = ?, image_filename = COALESCE(?, image_filename) WHERE vacation_id = ?',
      [destination, description, start_date, end_date, price, image_filename, id]
    );

    if ((result as any).affectedRows === 0) {
      throw new Error('Vacation not found');
    }

    return this.getVacationById(id);
  }

  async deleteVacation(id: number) {
    const [result] = await this.pool.query('DELETE FROM vacations WHERE vacation_id = ?', [id]);
    if ((result as any).affectedRows === 0) {
      throw new Error('Vacation not found');
    }
  }

  async getVacationById(id: number) {
    const [rows] = await this.pool.query('SELECT * FROM vacations WHERE vacation_id = ?', [id]);
    return (rows as any[])[0];
  }

  async getPublicVacations() {
    console.log('Executing getPublicVacations query');
    const [rows] = await this.pool.query('SELECT vacation_id, destination, description, start_date, end_date, price, image_filename FROM vacations ORDER BY start_date ASC');
    console.log('Query result:', rows);
    return rows;
  }
}