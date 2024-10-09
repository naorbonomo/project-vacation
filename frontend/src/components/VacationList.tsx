// frontend/src/components/VacationList.tsx
import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import './VacationList.css';
import APP_CONFIG from '../utils/appconfig';

interface Vacation {
    id: {
        vacation_id: number;
        destination: string;
        description: string;
        start_date: string;
        end_date: string;
        price: string;
        image_filename: string;
    },
    imageUrl: string;
}

type ApiResponse = Vacation[];

const VacationList: React.FC<{ user: any }> = ({ user }) => {
    const [vacations, setVacations] = useState<Vacation[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVacations = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response: AxiosResponse<ApiResponse> = await axios.get(`${APP_CONFIG.API_BASE_URL}/api/vacations`);
                setVacations(response.data);
            } catch (error) {
                console.error('Error fetching vacations:', error);
                setError('Failed to fetch vacations. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVacations();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this vacation?')) {
            try {
                await axios.delete(`${APP_CONFIG.API_BASE_URL}/api/vacations/${id}`);
                setVacations(vacations.filter(v => v.id.vacation_id !== id));
                alert('Vacation deleted successfully');
            } catch (error) {
                console.error('Error deleting vacation:', error);
                alert('Failed to delete vacation. Please try again later.');
            }
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/vacation-edit/${id}`);
    };

    if (isLoading) {
        return <div>Loading vacations...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="vacation-list">
            <h1>Vacation List</h1>
            {vacations.length === 0 ? (
                <p>No vacations available at the moment.</p>
            ) : (
                <div className="vacation-grid">
                    {vacations.map((vacation) => (
                        <div key={vacation.id.vacation_id} className="vacation-card">
                            <img
                                src={vacation.id.image_filename}
                                alt={vacation.id.destination}
                                className="vacation-image"
                            />
                            <h2>{vacation.id.destination}</h2>
                            <p>{vacation.id.description}</p>
                            <p>Start Date: {new Date(vacation.id.start_date).toLocaleDateString()}</p>
                            <p>End Date: {new Date(vacation.id.end_date).toLocaleDateString()}</p>
                            <p>Price: ${parseFloat(vacation.id.price).toFixed(2)}</p>
                            {user.role === 'Admin' && (
                                <>
                                    <button onClick={() => handleEdit(vacation.id.vacation_id)}>Edit</button>
                                    <button onClick={() => handleDelete(vacation.id.vacation_id)}>Delete</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VacationList;
