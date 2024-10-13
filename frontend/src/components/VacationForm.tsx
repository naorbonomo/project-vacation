import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import APP_CONFIG from '../utils/appconfig';
import './VacationForm.css';

const VacationForm: React.FC = () => {
    const [vacation, setVacation] = useState({
        destination: '',
        description: '',
        startDate: '',
        endDate: '',
        price: '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { id } = useParams();

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            axios.get(`${APP_CONFIG.API_BASE_URL}/api/vacations/${id}`)
                .then((response) => {
                    setVacation({
                        destination: response.data.destination,
                        description: response.data.description,
                        startDate: new Date(response.data.startDate).toISOString().split('T')[0],
                        endDate: new Date(response.data.endDate).toISOString().split('T')[0],
                        price: response.data.price,
                    });
                    if (response.data.image) {
                        setPreview(response.data.image);
                    }
                })
                .catch((error) => console.error('Error fetching vacation data', error));
        } else {
            // Preselect today's date for new vacations
            setVacation(prev => ({
                ...prev,
                startDate: today,
                endDate: today
            }));
        }
    }, [id, today]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVacation({ ...vacation, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append('destination', vacation.destination);
        formData.append('description', vacation.description);
        formData.append('startDate', vacation.startDate);
        formData.append('endDate', vacation.endDate);
        formData.append('price', vacation.price);
        if (file) {
            formData.append('image', file);
        }

        try {
            if (isEdit) {
                await axios.put(`${APP_CONFIG.API_BASE_URL}/api/vacations/${id}`, formData);
                alert('Vacation updated successfully');
            } else {
                await axios.post(`${APP_CONFIG.API_BASE_URL}/api/vacations`, formData);
                alert('Vacation added successfully');
            }
            navigate('/vacation-list');
        } catch (error) {
            console.error('Error saving vacation:', error);
            alert('Failed to save vacation. Please try again.');
        }
    };

    const validateForm = () => {
        if (vacation.endDate < vacation.startDate) {
            setError('End date must be later than or equal to the start date.');
            return false;
        }
        const price = parseFloat(vacation.price);
        if (isNaN(price) || price < 0 || price > 10000) {
            setError('Price must be a positive number between 0 and 10,000.');
            return false;
        }
        setError(null);
        return true;
    };

    const handleCancel = () => {
        navigate('/vacation-list');
    };

    return (
        <div className="vacation-form-container">
            <div className="vacation-form">
                <h1>{isEdit ? 'Edit Vacation' : 'Add Vacation'}</h1>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="destination">Destination:</label>
                    <input 
                        id="destination" 
                        type="text" 
                        name="destination" 
                        value={vacation.destination} 
                        onChange={handleInputChange} 
                        required 
                    />
                    
                    <label htmlFor="description">Description:</label>
                    <input 
                        id="description" 
                        type="text" 
                        name="description" 
                        value={vacation.description} 
                        onChange={handleInputChange} 
                        required 
                    />
                    
                    <label htmlFor="startDate">Start Date:</label>
                    <input 
                        id="startDate" 
                        type="date" 
                        name="startDate" 
                        value={vacation.startDate} 
                        onChange={handleInputChange} 
                        min={today}
                        required 
                    />
                    
                    <label htmlFor="endDate">End Date:</label>
                    <input 
                        id="endDate" 
                        type="date" 
                        name="endDate" 
                        value={vacation.endDate} 
                        onChange={handleInputChange} 
                        min={vacation.startDate || today}
                        required 
                    />
                    
                    <label htmlFor="price">Price:</label>
                    <input 
                        id="price" 
                        type="number" 
                        name="price" 
                        value={vacation.price} 
                        onChange={handleInputChange} 
                        required 
                    />
                    
                    <label htmlFor="image">Image:</label>
                    <input 
                        id="image" 
                        type="file" 
                        name="image" 
                        onChange={handleFileChange} 
                    />
                    {preview && (
                        <div>
                            <img 
                                src={preview} 
                                alt="Vacation Preview" 
                                style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} 
                            />
                        </div>
                    )}
                    
                    <div className="button-group">
                        <button type="submit" className="primary-button">
                            {isEdit ? 'Update Vacation' : 'Add Vacation'}
                        </button>
                    </div>
                    <div className="button-group">
                        <button type="button" onClick={handleCancel} className="secondary-button">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VacationForm;