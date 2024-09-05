// frontend/src/components/VacationForm.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const VacationForm: React.FC = () => {
  const [vacation, setVacation] = useState({
    destination: '',
    description: '',
    startDate: '',
    endDate: '',
    price: '',
    image: null as File | null,
  });
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();  // For edit mode

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      axios.get(`http://localhost:4002/api/vacations/${id}`)
        .then((response) => {
          setVacation({
            destination: response.data.destination,
            description: response.data.description,
            startDate: new Date(response.data.startDate).toISOString().slice(0, 10),
            endDate: new Date(response.data.endDate).toISOString().slice(0, 10),
            price: response.data.price,
            image: null,
          });
        })
        .catch((error) => console.error("Error fetching vacation data", error));
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVacation({ ...vacation, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVacation({ ...vacation, image: e.target.files[0] });
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
    if (vacation.image) {
      formData.append('image', vacation.image); // Add image only if updated
    }

    try {
      if (isEdit) {
        await axios.put(`http://localhost:4002/api/vacations/${id}`, formData);
        alert('Vacation updated successfully');
      } else {
        await axios.post('http://localhost:4002/api/vacations', formData);
        alert('Vacation added successfully');
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving vacation:', error);
    }
  };

  return (
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
        <input type="file" name="image" onChange={handleImageChange} required />
      </div>
      <button type="submit">{isEdit ? 'Update Vacation' : 'Add Vacation'}</button>
    </form>
  );
};

export default VacationForm;