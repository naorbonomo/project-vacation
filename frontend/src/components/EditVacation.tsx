// backend/src/components/EditVacation.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface VacationData {
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: string;
}

const EditVacation: React.FC = () => {
  const [formData, setFormData] = useState<VacationData>({
    destination: '',
    description: '',
    start_date: '',
    end_date: '',
    price: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacation = async () => {
      try {
        // const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4002/api/vacations/${id}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`
        //   }
        });
        const vacation = response.data;
        setFormData({
          destination: vacation.destination,
          description: vacation.description,
          start_date: vacation.start_date.split('T')[0],
          end_date: vacation.end_date.split('T')[0],
          price: vacation.price.toString(),
        });
      } catch (error) {
        console.error('Error fetching vacation:', error);
        setError('Failed to fetch vacation details');
      }
    };

    fetchVacation();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      await axios.put(`http://localhost:4002/api/vacations/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating vacation:', error);
      setError('Failed to update vacation');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Edit Vacation</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Destination"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          type="file"
          onChange={handleImageChange}
        />
        <button type="submit">Update Vacation</button>
      </form>
    </div>
  );
};

export default EditVacation;