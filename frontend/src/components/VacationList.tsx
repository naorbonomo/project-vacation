import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import './VacationList.css';
import APP_CONFIG from '../utils/appconfig';
import { followVacation, unfollowVacation, getFollowedVacationsByUser } from '../api/followAPI';
import { deleteVacation } from '../api/vacationsAPI';

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
    followersCount: number;
    isFollowed: boolean;
}

type ApiResponse = Vacation[];

const VacationList: React.FC<{ user: any }> = ({ user }) => {
    const [vacations, setVacations] = useState<Vacation[]>([]);
    const [followedVacations, setFollowedVacations] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 3;
    const navigate = useNavigate();

    const [showOnlyFollowed, setShowOnlyFollowed] = useState<boolean>(false);
    const [showOnlyFuture, setShowOnlyFuture] = useState<boolean>(false);
    const [showOnlyActive, setShowOnlyActive] = useState<boolean>(false);

    useEffect(() => {
        const fetchVacations = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response: AxiosResponse<ApiResponse> = await axios.get(`${APP_CONFIG.API_BASE_URL}/api/vacations-with-followers`);
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

    const handleFollow = async (vacationId: number) => {
        try {
            await followVacation(user.id, vacationId);
            setFollowedVacations([...followedVacations, vacationId]);
            setVacations(vacations.map(v =>
                v.id.vacation_id === vacationId
                    ? { ...v, followersCount: v.followersCount + 1 }
                    : v
            ));
        } catch (error) {
            console.error('Error following vacation:', error);
            alert('Failed to follow the vacation. Please try again later.');
        }
    };

    const handleUnfollow = async (vacationId: number) => {
        try {
            await unfollowVacation(user.id, vacationId);
            setFollowedVacations(followedVacations.filter(id => id !== vacationId));
            setVacations(vacations.map(v =>
                v.id.vacation_id === vacationId
                    ? { ...v, followersCount: v.followersCount - 1 }
                    : v
            ));
        } catch (error) {
            console.error('Error unfollowing vacation:', error);
            alert('Failed to unfollow the vacation. Please try again later.');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this vacation?')) {
            try {
                await deleteVacation(id);
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

    const filteredVacations = vacations.filter(vacation => {
        const startDate = new Date(vacation.id.start_date);
        const endDate = new Date(vacation.id.end_date);
        const now = new Date();

        if (showOnlyFollowed && user.role !== 'Admin' && !followedVacations.includes(vacation.id.vacation_id)) {
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
            <h1>Vacation List</h1>
            <div className="filter-options">
                {user.role !== 'Admin' && (
                    <label>
                        <input
                            type="checkbox"
                            checked={showOnlyFollowed}
                            onChange={(e) => setShowOnlyFollowed(e.target.checked)}
                        />
                        Show only vacations I follow
                    </label>
                )}
                <label>
                    <input
                        type="checkbox"
                        checked={showOnlyFuture}
                        onChange={(e) => setShowOnlyFuture(e.target.checked)}
                    />
                    Show only future vacations
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={showOnlyActive}
                        onChange={(e) => setShowOnlyActive(e.target.checked)}
                    />
                    Show only active vacations
                </label>
            </div>
            {filteredVacations.length === 0 ? (
                <p className="no-vacations">No vacations available based on your filters.</p>
            ) : (
                <>
                    <div className="vacation-grid">
                        {currentVacations.map((vacation) => (
                            <div key={vacation.id.vacation_id} className="vacation-card">
                                <img
                                    src={vacation.id.image_filename}
                                    alt={vacation.id.destination}
                                    className="vacation-image"
                                />
                                <div className="vacation-details">
                                    <h2>{vacation.id.destination}</h2>
                                    <p className="description">{vacation.id.description}</p>
                                    <p>Start Date: {new Date(vacation.id.start_date).toLocaleDateString()}</p>
                                    <p>End Date: {new Date(vacation.id.end_date).toLocaleDateString()}</p>
                                    <p className="price">Price: ${parseFloat(vacation.id.price).toFixed(2)}</p>
                                    <p className="followers">Followers: {vacation.followersCount}</p>
                                    {user.role === 'Admin' ? (
                                        <div className="admin-actions">
                                            <button onClick={() => handleEdit(vacation.id.vacation_id)}>Edit</button>
                                            <button onClick={() => handleDelete(vacation.id.vacation_id)} className="delete">Delete</button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => followedVacations.includes(vacation.id.vacation_id) 
                                                ? handleUnfollow(vacation.id.vacation_id) 
                                                : handleFollow(vacation.id.vacation_id)}
                                            className={followedVacations.includes(vacation.id.vacation_id) ? 'unfollow' : 'follow'}
                                        >
                                            {followedVacations.includes(vacation.id.vacation_id) ? 'Unfollow' : 'Follow'}
                                        </button>
                                    )}
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