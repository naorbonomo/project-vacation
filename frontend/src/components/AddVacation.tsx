import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddVacation: React.FC = () => {
  const [formData, setFormData] = useState({
    destination: '',
    description: '',
    startDate: '',
    endDate: '',
    price: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    console.log('Token:', token); // Log the token

    // Log the user information
    const userString = localStorage.getItem('user');
    console.log('User:', userString ? JSON.parse(userString) : null);

    setError(null);
    setSuccess(false);
    
    if (!token) {
      setError('You must be logged in to add a vacation');
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key as keyof typeof formData]);
    });
    if (image) {
      formDataToSend.append('image', image);
    } else {
      console.error('No image selected');
      return;
    }

    console.log('Sending form data:', Object.fromEntries(formDataToSend));

    try {
      console.log('Sending request with headers:', {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      });
      const response = await axios.post('http://localhost:4002/api/vacations', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Vacation added successfully:', response.data);
      setSuccess(true);
      // Clear the form
      setFormData({
        destination: '',
        description: '',
        startDate: '',
        endDate: '',
        price: '',
      });
      setImage(null);
      // Redirect to vacations list after a short delay
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Full error object:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
        if (error.response?.status === 403) {
          setError('You do not have permission to add vacations. Please make sure you are logged in as an admin.');
        } else {
          setError(error.response?.data?.error || 'An error occurred while adding the vacation');
        }
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Error adding vacation:', error);
    }
  };

  return (
    <div>
      <h2>Add New Vacation</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Vacation added successfully! Redirecting...</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="destination" onChange={handleChange} placeholder="Destination" required />
        <input type="text" name="description" onChange={handleChange} placeholder="Description" required />
        <input type="date" name="startDate" onChange={handleChange} required />
        <input type="date" name="endDate" onChange={handleChange} required />
        <input type="number" name="price" onChange={handleChange} placeholder="Price" required />
        <input type="file" onChange={handleImageChange} accept="image/*" required />
        <button type="submit">Add Vacation</button>
      </form>
    </div>
  );
};

export default AddVacation;