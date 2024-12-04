import React, { useState } from 'react';
import { getVacationRecommendation, getVacationById } from '../api/vacationsAPI';
import { Heart } from 'lucide-react';
import './VacationList.css';

const VacationRecommendation: React.FC = () => {
    const [preferences, setPreferences] = useState('');
    const [recommendation, setRecommendation] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (preferences.trim()) {
            setIsLoading(true);
            try {
                const result = await getVacationRecommendation(preferences);
                const parsedRecommendation = JSON.parse(result);
                
                // If we receive a vacation_id, fetch the vacation details
                if (parsedRecommendation.vacation_id) {
                    // Add this function to your vacationsAPI.ts
                    const vacationDetails = await getVacationById(parsedRecommendation.vacation_id);
                    setRecommendation({
                        vacation_id: vacationDetails.vacation_id,
                        destination: vacationDetails.destination,
                        description: vacationDetails.description,
                        start_date: vacationDetails.start_date,
                        end_date: vacationDetails.end_date,
                        price: vacationDetails.price,
                        image_filename: vacationDetails.image_filename,
                        followersCount: vacationDetails.followersCount || 0
                    });
                }
            } catch (error) {
                console.error('Error fetching recommendation:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const renderRecommendationCard = (vacation: any) => {
        return (
            <div key={vacation.vacation_id} className="vacation-card">
                <div className="image-container">
                    <img
                        src={vacation.image_filename || '/images/default-vacation.jpg'}
                        alt={vacation.destination}
                        className="vacation-image"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/default-vacation.jpg';
                        }}
                    />
                    <div className="overlay-content">
                        <div className="likes-count">
                            <Heart size={24} />
                            <span>{vacation.followersCount}</span>
                        </div>
                    </div>
                </div>
                <div className="vacation-details">
                    <h2>{vacation.destination}</h2>
                    <p className="description">{vacation.description}</p>
                    <p>Start Date: {new Date(vacation.start_date).toLocaleDateString()}</p>
                    <p>End Date: {new Date(vacation.end_date).toLocaleDateString()}</p>
                    <p className="price">Price: ${parseFloat(vacation.price).toFixed(2)}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="vacation-recommendation">
            <h2>Find a Vacation</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your vacation preferences"
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Getting Recommendation...' : 'Get Recommendation'}
                </button>
            </form>
            <div className="recommendation">
                {recommendation && renderRecommendationCard(recommendation)}
            </div>
        </div>
    );
};

export default VacationRecommendation;
