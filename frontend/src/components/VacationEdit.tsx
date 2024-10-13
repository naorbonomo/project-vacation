import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import APP_CONFIG from '../utils/appconfig';
import './VacationForm.css';
import { fetchVacation, updateVacation } from '../api/vacationsAPI';

const VacationEdit: React.FC = () => {
  const [vacation, setVacation] = useState({
    destination: '',
    description: '',
    startDate: '',
    endDate: '',
    price: '',
    image_filename: '',
  });
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();

  useEffect(() => {
    const loadVacation = async () => {
      if (!id) {
        setError('Invalid vacation ID.');
        return;
      }
  
      try {
        const vacationData = await fetchVacation(id);
        console.log('Fetched vacation data:', vacationData);
  
        setVacation({
          destination: vacationData.destination,
          description: vacationData.description,
          startDate: vacationData.start_date.split('T')[0],
          endDate: vacationData.end_date.split('T')[0],
          price: vacationData.price.toString(),
          image_filename: vacationData.image_filename,
        });
  
        if (vacationData.image_filename) {
          setPreview(`${vacationData.image_filename}`);
        }
      } catch (error) {
        console.error('Error fetching vacation data', error);
        setError('Failed to load vacation details. Please try again later.');
      }
    };
  
    loadVacation();
  }, [id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVacation({ ...vacation, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    if (vacation.endDate <= vacation.startDate) {
      setError('End date must be later than the start date.');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    if (!id) {
      setError('Invalid vacation ID.');
      return;
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
  
    console.log('Form data entries:');
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
  
    try {
      await updateVacation(id, formData);
      alert('Vacation updated successfully');
      navigate('/vacation-list');
    } catch (error) {
      console.error('Error updating vacation:', error);
      alert('Failed to update vacation. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/vacation-list');
  };

  return (
    <div className="vacation-form-container">
      <div className="vacation-form">
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
            <button type="submit" className="primary-button">Update Vacation</button>
          </div>
          <div className="button-group">
            <button type="button" onClick={handleCancel} className="secondary-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VacationEdit;