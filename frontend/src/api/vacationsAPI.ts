// frontend/src/api/vacationsAPI.ts

import axios from 'axios';
import { Vacation } from '../types/vacationType';
import APP_CONFIG from '../utils/appconfig';

// 
export async function getVacations(): Promise<Vacation[]> {
    const response = await axios.get(`${APP_CONFIG.API_BASE_URL}/api/vacations`);
    return response.data;
}

//  function to fetch vacations with follower counts for admin report
export async function getVacationsWithFollowers(): Promise<Vacation[]> {
    const response = await axios.get(`${APP_CONFIG.API_BASE_URL}/api/vacations-with-followers`);
    return response.data;
}

//  delete a vacation by ID
export async function deleteVacation(vacationId: number): Promise<void> {
    await axios.delete(`${APP_CONFIG.API_BASE_URL}/api/vacations/${vacationId}`);
}

// Fetch a vacation by ID
export async function fetchVacation(id: string): Promise<Vacation> {
    const response = await axios.get(`${APP_CONFIG.API_BASE_URL}/api/vacations/${id}`);
    return response.data.id;
}

// Update a vacation by ID
export async function updateVacation(id: string, formData: FormData): Promise<void> {
    await axios.put(`${APP_CONFIG.API_BASE_URL}/api/vacations/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}
// Send vacation preferences to the Groq API and get a recommendation
export async function getVacationRecommendation(preferences: string): Promise<string> {
    const response = await axios.post(`${APP_CONFIG.API_BASE_URL}/api/vacation-recommendation`, { preferences });
    return response.data.recommendation;
}
// Fetch a vacation by destination (or ID, depending on your structure)
export async function fetchVacationByDestination(destination: string): Promise<Vacation> {
    const response = await axios.get(`${APP_CONFIG.API_BASE_URL}/api/vacations/destination/${destination}`);
    return response.data;  // Assuming you return the vacation data including image_filename
}

export const getVacationById = async (id: number) => {
    const response = await fetch(`/api/vacations/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
};
