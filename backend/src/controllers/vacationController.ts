import { Request, Response } from 'express';
import { VacationService } from '../services/vacationService';

export class VacationController {
  constructor(private vacationService: VacationService) {}

  getAllVacations = async (req: Request, res: Response) => {
    try {
      console.log('Fetching all vacations');
      const vacations = await this.vacationService.getAllVacations();
      console.log('Vacations fetched:', vacations);
      res.json(vacations);
    } catch (error) {
      console.error('Error fetching vacations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  createVacation = async (req: Request, res: Response) => {
    try {
      const { title, description, price, startDate, endDate } = req.body;
      const imageUrl = req.file ? `/images/${req.file.filename}` : null;

      // Create the vacation using the service
      const vacation = await this.vacationService.createVacation({
        title,
        description,
        price: parseFloat(price),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        imageUrl
      });

      res.status(201).json({ message: 'Vacation created successfully', vacation });
    } catch (error) {
      console.error('Error creating vacation:', error);
      res.status(500).json({ message: 'Error creating vacation', error: (error as Error).message });
    }
  }

  updateVacation = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedVacation = await this.vacationService.updateVacation(parseInt(id), req.body, req.file);
      res.json(updatedVacation);
    } catch (error) {
      console.error('Error updating vacation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  deleteVacation = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.vacationService.deleteVacation(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting vacation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  getVacationById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const vacation = await this.vacationService.getVacationById(parseInt(id));
      if (vacation) {
        res.json(vacation);
      } else {
        res.status(404).json({ error: 'Vacation not found' });
      }
    } catch (error) {
      console.error('Error fetching vacation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  getPublicVacations = async (req: Request, res: Response) => {
    try {
      console.log('Fetching public vacations');
      const vacations = await this.vacationService.getPublicVacations();
      console.log('Public vacations fetched:', vacations);
      res.json(vacations);
    } catch (error) {
      console.error('Error fetching public vacations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}