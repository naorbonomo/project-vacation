import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import APP_CONFIG from '../utils/appconfig';  // Assuming there's a config file

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

  const { id } = useParams();  // Get vacation ID from URL params

  useEffect(() => {
    // Fetch vacation data by ID
    const fetchVacation = async () => {
      try {
        const response = await axios.get(`${APP_CONFIG.API_BASE_URL}/api/vacations/${id}`);
  console.log(response.data.id);
  
        // const startDate = response.data.id.startDate ;
        // const endDate = response.data.id.endDate;
        const vacation = response.data.id;
        console.log(`this is the date` + vacation.startDate);

        setVacation({
          destination: vacation.destination,
          description: vacation.description,
          startDate: vacation.startDate.split('T')[0],
          endDate: vacation.endDate,
          price: vacation.price,
        });
        
      } catch (error) {
        console.error('Error fetching vacation data', error);
        alert('Failed to load vacation details. Please try again later.');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('destination', vacation.destination);
    formData.append('description', vacation.description);
    formData.append('startDate', vacation.startDate);
    formData.append('endDate', vacation.endDate);
    formData.append('price', vacation.price);


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
