import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import './VacationList.css';
import APP_CONFIG from '../utils/appconfig';
import { followVacation, unfollowVacation, getFollowedVacationsByUser } from '../api/followAPI';
import { deleteVacation, getVacationsWithFollowers } from '../api/vacationsAPI';
import { Heart } from 'lucide-react';
import { Vacation } from '../types/vacationType';

const VacationList: React.FC<{ user: any }> = ({ user }) => {
    const [vacations, setVacations] = useState<Vacation[]>([]);
    const [followedVacations, setFollowedVacations] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const [showOnlyFollowed, setShowOnlyFollowed] = useState<boolean>(false);
    const [showOnlyFuture, setShowOnlyFuture] = useState<boolean>(false);
    const [showOnlyActive, setShowOnlyActive] = useState<boolean>(false);

    useEffect(() => {
        const fetchVacations = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // const response: AxiosResponse<ApiResponse> = await axios.get(`${APP_CONFIG.API_BASE_URL}/api/vacations-with-followers`);
                const data = await getVacationsWithFollowers();
                const formattedData = data.map((v: any) => ({
                    vacation_id: v.id.vacation_id,
                    destination: v.id.destination,
                    description: v.id.description,
                    start_date: v.id.start_date,
                    end_date: v.id.end_date,
                    price: v.id.price,
                    image_filename: v.id.image_filename,
                    followersCount: v.id.followersCount,
                  }));
                console.log(formattedData);
                
                setVacations(formattedData);
            } catch (error) {
                console.error('Error fetching vacations:', error);
                setError('Failed to fetch vacations. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVacations();
    }, []);

    useEffect(() => {
        const fetchFollowedVacations = async () => {
            try {
                const followedVacationIds = await getFollowedVacationsByUser(user.id);
                setFollowedVacations(followedVacationIds);
            } catch (error) {
                console.error('Error fetching followed vacations:', error);
            }
        };

        if (user && user.id) {
            fetchFollowedVacations();
        }
    }, [user]);

    const handleLike = async (vacationId: number) => {
        try {
            if (followedVacations.includes(vacationId)) {
                await unfollowVacation(user.id, vacationId);
                setFollowedVacations(followedVacations.filter(id => id !== vacationId));
                setVacations(vacations.map(v =>
                    v.vacation_id === vacationId
                        ? { ...v, followersCount: v.followersCount - 1 }
                        : v
                ));
            } else {
                await followVacation(user.id, vacationId);
                setFollowedVacations([...followedVacations, vacationId]);
                setVacations(vacations.map(v =>
                    v.vacation_id === vacationId
                        ? { ...v, followersCount: v.followersCount + 1 }
                        : v
                ));
            }
        } catch (error) {
            console.error('Error toggling vacation like:', error);
            alert('Failed to update vacation like status. Please try again later.');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this vacation?')) {
            try {
                await deleteVacation(id);
                setVacations(vacations.filter(v => v.vacation_id !== id));
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

    const filteredVacations = vacations.filter(vacation => {
        const startDate = new Date(vacation.start_date);
        const endDate = new Date(vacation.end_date);
        const now = new Date();

        if (showOnlyFollowed && user.role !== 'Admin' && !followedVacations.includes(vacation.vacation_id)) {
            return false;
        }

        if (showOnlyFuture && startDate <= now) {
            return false;
        }

        if (showOnlyActive && (endDate < now || startDate > now)) {
            return false;
        }

        return true;
    });

    const handleFilterChange = (filterSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
        filterSetter(prev => {
            setCurrentPage(1);
            return !prev;
        });
    };

    const totalPages = Math.ceil(filteredVacations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentVacations = filteredVacations.slice(startIndex, startIndex + itemsPerPage);

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    if (isLoading) {
        return <div className="loading">Loading vacations...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="vacation-list">
            <h1>Where to next, {user.first_name}</h1>
            <div className="filter-options">
                {user.role !== 'Admin' && (
                    <label className="custom-checkbox">
                        <input
                            type="checkbox"
                            checked={showOnlyFollowed}
                            onChange={() => handleFilterChange(setShowOnlyFollowed)}
                        />
                        <span>Show only vacations I like</span>
                    </label>
                )}
                <label className="custom-checkbox">
                    <input
                        type="checkbox"
                        checked={showOnlyFuture}
                        onChange={() => handleFilterChange(setShowOnlyFuture)}
                    />
                    <span>Show only future vacations</span>
                </label>
                <label className="custom-checkbox">
                    <input
                        type="checkbox"
                        checked={showOnlyActive}
                        onChange={() => handleFilterChange(setShowOnlyActive)}
                    />
                    <span>Show only active vacations</span>
                </label>
            </div>

            {filteredVacations.length === 0 ? (
                <p className="no-vacations">No vacations available based on your filters.</p>
            ) : (
                <>
                    <div className="vacation-grid">
                        {currentVacations.map((vacation) => (
                            <div key={vacation.vacation_id} className="vacation-card">
                                <div className="image-container">
                                    <img
                                        src={vacation.image_filename}
                                        alt={vacation.destination}
                                        className={`vacation-image ${user?.role === 'Admin' ? 'bw-image' : ''}`}
                                    />
                                    <div className="overlay-content">
                                        {user.role === 'Admin' ? (
                                            <>
                                                <div className="likes-count">
                                                    <Heart size={24} />
                                                    <span>{vacation.followersCount}</span>
                                                </div>
                                                <div className="admin-actions">
                                                    <button onClick={() => handleEdit(vacation.vacation_id)} className="edit">Edit</button>
                                                    <button onClick={() => handleDelete(vacation.vacation_id)} className="delete">Delete</button>
                                                </div>
                                            </>
                                        ) : (
                                            <div 
                                                onClick={() => handleLike(vacation.vacation_id)}
                                                className={`likes-count like-button ${followedVacations.includes(vacation.vacation_id) ? 'liked' : ''}`}
                                            >
                                                <Heart 
                                                    size={24} 
                                                    fill={followedVacations.includes(vacation.vacation_id) ? "red" : "none"}
                                                    stroke={followedVacations.includes(vacation.vacation_id) ? "red" : "currentColor"}
                                                />
                                                <span>{vacation.followersCount}</span>
                                            </div>
                                        )}
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
                        ))}
                    </div>
                    <div className="pagination-controls">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default VacationList;