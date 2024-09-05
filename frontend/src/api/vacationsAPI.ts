import axios from 'axios';
import { Vacation } from '../types/vacationType';
import appconfig from '../utils/appconfig';

export async function getVacations(): Promise<Vacation[]> {
    const response = await axios.get(`${appconfig.API_BASE_URL}/api/vacations`);
    return response.data;
}


