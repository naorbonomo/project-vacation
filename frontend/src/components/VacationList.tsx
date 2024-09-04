import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Vacation {
  vacation_id: number;
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  image_filename: string;
}

const VacationList: React.FC = () => {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const fetchVacations = async () => {
      if (!isAuthenticated) {
        console.log('User is not authenticated');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        const response = await axios.get('http://localhost:4002/api/vacations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setVacations(response.data);
      } catch (error) {
        console.error('Error fetching vacations:', error);
      }
    };

    fetchVacations();
  }, [isAuthenticated]);

  return (
    <div>
      <h1>Vacation List</h1>
      {vacations.map((vacation) => (
        <div key={vacation.vacation_id}>
          <h2>{vacation.destination}</h2>
          <p>{vacation.description}</p>
          <p>Start Date: {vacation.start_date}</p>
          <p>End Date: {vacation.end_date}</p>
          <p>Price: ${vacation.price}</p>
          <img src={`http://localhost:4002/images/${vacation.image_filename}`} alt={vacation.destination} />
          {isAuthenticated && (
            <button>Follow</button>
          )}
          {isAdmin && (
            <>
              <button>Edit</button>
              <button>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default VacationList;