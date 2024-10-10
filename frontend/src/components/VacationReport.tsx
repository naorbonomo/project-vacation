// frontend/src/components/VacationReport.tsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getVacationsWithFollowers } from '../api/vacationsAPI';
import { Vacation } from '../types/vacationType';
import './VacationReport.css'; // Import the styles for the report

// Register necessary components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VacationReport: React.FC = () => {
  const [vacations, setVacations] = useState<Vacation[]>([]);

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const data = await getVacationsWithFollowers();
        console.log('Fetched data:', data);

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

        console.log('Formatted data:', formattedData);
        setVacations(formattedData);
      } catch (error) {
        console.error('Error fetching vacations', error);
      }
    };

    fetchVacations();
  }, []);

  const data = {
    labels: vacations.map((vacation) => vacation.destination),
    datasets: [
      {
        label: 'Number of Followers',
        data: vacations.map((vacation) => vacation.followersCount),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const downloadCSV = () => {
    // Prepare CSV header
    const headers = ['Destination', 'Followers'];
    const rows = vacations.map(v => [v.destination, v.followersCount]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    // Create a link and simulate a click to download the file
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vacation_report.csv';
    a.click();

    // Clean up the URL object
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="vacation-report-container">
      <div className="vacation-report-card">
        <h2>Vacations Report</h2>
        <button className="download-csv-button" onClick={downloadCSV}>
          Download CSV
        </button>
        <div className="chart-container">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default VacationReport;
