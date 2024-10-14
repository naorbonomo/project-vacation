import React, { useState } from 'react';
import { getVacationRecommendation } from '../api/vacationsAPI';
import './VacationList.css'; // Reuse the existing CSS for the card styling

const VacationRecommendation: React.FC = () => {
    const [preferences, setPreferences] = useState('');
    const [recommendation, setRecommendation] = useState<any>(null);  // Store the parsed recommendation

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPreferences(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (preferences.trim()) {
            try {
                const result = await getVacationRecommendation(preferences);
                try {
                    // Attempt to parse the recommendation as JSON
                    const parsedRecommendation = JSON.parse(result);
                    setRecommendation(parsedRecommendation);
                } catch (error) {
                    // If not valid JSON, treat it as a raw string
                    setRecommendation(result);
                }
            } catch (error) {
                console.error('Error fetching recommendation:', error);
            }
        }
    };

    const renderRecommendationCard = (vacation: any) => {
        return (
            <div key={vacation.destination} className="vacation-card">
                <div className="image-container">
                    {/* Use a placeholder image or the vacation's image if available */}
                    <img
                        src={vacation.image_filename || '/default-image.jpg'}
                        alt={vacation.destination}
                        className="vacation-image"
                    />
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

    const renderRecommendations = () => {
        if (!recommendation) return null;

        if (typeof recommendation === 'string') {
            return <p>{recommendation}</p>;
        } else if (recommendation.options) {
            // If there are multiple options, render them as vacation cards
            return (
                <div className="vacation-grid">
                    {recommendation.options.map((option: any) => renderRecommendationCard(option))}
                </div>
            );
        } else {
            // Render a single vacation suggestion
            return renderRecommendationCard(recommendation);
        }
    };

    return (
        <div className="vacation-recommendation">
            <h2>Find a Vacation</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your vacation preferences"
                    value={preferences}
                    onChange={handleInputChange}
                />
                <button type="submit">Get Recommendation</button>
            </form>
            <div className="recommendation">
                {renderRecommendations()}
            </div>
        </div>
    );
};

export default VacationRecommendation;
