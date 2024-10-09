import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import APP_CONFIG from '../utils/appconfig';

const VacationEdit: React.FC = () => {
  const [vacation, setVacation] = useState({
    destination: '',
    description: '',
    startDate: '',
    endDate: '',
    price: '',
  });
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();  // Get vacation ID from URL params

  useEffect(() => {
    // Fetch vacation data by ID
    const fetchVacation = async () => {
      try {
        const response = await axios.get(`${APP_CONFIG.API_BASE_URL}/api/vacations/${id}`);
        const vacationData = response.data.id; // Access the nested data correctly
        console.log('Fetched vacation data:', vacationData);
  
        setVacation({
          destination: vacationData.destination,
          description: vacationData.description,
          startDate: vacationData.start_date.split('T')[0], // Format date for input fields
          endDate: vacationData.end_date.split('T')[0],
          price: vacationData.price.toString(),
        });
      } catch (error) {
        console.error('Error fetching vacation data', error);
        setError('Failed to load vacation details. Please try again later.');
      }
    };
  
    fetchVacation();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVacation({ ...vacation, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const validateForm = (): boolean => {
    // Ensure end date is later than start date
    if (vacation.endDate <= vacation.startDate) {
      setError('End date must be later than the start date.');
      return false;
    }

    // Ensure price is a positive number and does not exceed 10,000
    const price = parseFloat(vacation.price);
    if (isNaN(price) || price < 0 || price > 10000) {
      setError('Price must be a positive number between 0 and 10,000.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    const formData = new FormData();
    formData.append('destination', vacation.destination);
    formData.append('description', vacation.description);
    formData.append('startDate', vacation.startDate);
    formData.append('endDate', vacation.endDate);
    formData.append('price', vacation.price);
    if (image) {
      formData.append('image', image);
    }
  
    // Log each value to ensure they are set correctly
    console.log('Form data entries:');
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
  
    try {
      await axios.put(`${APP_CONFIG.API_BASE_URL}/api/vacations/${id}`, formData);
      alert('Vacation updated successfully');
      navigate('/');  // Redirect to the home or vacation list
    } catch (error) {
      console.error('Error updating vacation:', error);
      alert('Failed to update vacation. Please try again.');
    }
  };

  return (
    <div>
      <h1>Edit Vacation</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Destination:</label>
          <input type="text" name="destination" value={vacation.destination} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" name="description" value={vacation.description} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Start Date:</label>
          <input type="date" name="startDate" value={vacation.startDate} onChange={handleInputChange} required />
        </div>
        <div>
          <label>End Date:</label>
          <input type="date" name="endDate" value={vacation.endDate} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="text" name="price" value={vacation.price} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" name="image" onChange={handleImageChange} />
        </div>
        <button type="submit">Update Vacation</button>
      </form>
    </div>
  );
};

export default VacationEdit;
