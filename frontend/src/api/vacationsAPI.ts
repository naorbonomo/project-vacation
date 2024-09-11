import axios from 'axios';
import { Vacation } from '../types/vacationType';
import APP_CONFIG from '../utils/appconfig';

export async function getVacations(): Promise<Vacation[]> {
    const response = await axios.get(`${APP_CONFIG.API_BASE_URL}/api/vacations`);
    return response.data;
}


