// frontend/src/api/followAPI.ts

import axios from 'axios';
import APP_CONFIG from '../utils/appconfig';
import { Vacation } from '../types/vacationType';

export async function followVacation(userId: number, vacationId: number): Promise<void> {
    await axios.post(`${APP_CONFIG.API_BASE_URL}/api/follow`, {
        user_id: userId,
        vacation_id: vacationId,
    });
}

export async function unfollowVacation(userId: number, vacationId: number): Promise<void> {
    await axios.post(`${APP_CONFIG.API_BASE_URL}/api/unfollow`, {
        user_id: userId,
        vacation_id: vacationId,
    });
}

// Method to get all vacations followed by a specific user
export async function getFollowedVacationsByUser(userId: number): Promise<number[]> {
    console.log("fetching followed vacations by user");
    const response = await axios.get(`${APP_CONFIG.API_BASE_URL}/api/followed-vacations/${userId}`);
    console.log("respone is :",response.data);
    
    return response.data;
}

