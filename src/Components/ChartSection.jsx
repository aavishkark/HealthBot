import {
  Box,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState } from 'react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ChartSection = ({ calories }) => {
  const [selectedMetric, setSelectedMetric] = useState('calories');

  const weekdaySums = {
    calories: Array(7).fill(0),
    proteins: Array(7).fill(0),
    carbs: Array(7).fill(0),
    fats: Array(7).fill(0),
  };

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  calories.forEach(entry => {
    const entryDate = new Date(entry.timestamp);
    if (entryDate < startOfWeek || entryDate > endOfWeek) return;

    let day = entryDate.getDay();
    day = (day + 6) % 7;

    const cals = parseFloat(entry.calories) || 0;
    const prots = parseFloat(entry.proteins) || 0;
    const fats = parseFloat(entry.fats) || 0;
    const carbs = parseFloat(entry.carbs) || 0;

    weekdaySums.calories[day] += cals;
    weekdaySums.proteins[day] += prots;
    weekdaySums.fats[day] += fats;
    weekdaySums.carbs[day] += carbs;
  });

  const chartData = {
    labels: weekdays,
    datasets: [
      {
        label: `${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} per day`,
        data: weekdaySums[selectedMetric],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(30, 37, 48, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#e6e8eb'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#e6e8eb'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        title: {
          display: true,
          text:
            selectedMetric === 'calories'
              ? 'Calories (kcal)'
              : `${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} (g)`,
          color: '#e6e8eb',
          font: {
            size: 14,
            weight: '600'
          }
        },
      },
    },
  };

  return (
    <Box my={4}>
      <Select
        value={selectedMetric}
        onChange={(e) => setSelectedMetric(e.target.value)}
        size="small"
        sx={{
          mb: 2,
          minWidth: 180,
          backgroundColor: 'rgba(30, 37, 48, 0.8)',
          color: '#e6e8eb',
          borderRadius: '0.75rem',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(148, 163, 184, 0.2)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(99, 102, 241, 0.3)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6366f1',
            boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
          },
          '& .MuiSvgIcon-root': {
            color: '#9ca3af',
          }
        }}
      >
        <MenuItem value="calories">Calories</MenuItem>
        <MenuItem value="proteins">Proteins</MenuItem>
        <MenuItem value="carbs">Carbs</MenuItem>
        <MenuItem value="fats">Fats</MenuItem>
      </Select>

      <Paper elevation={3}
        sx={{
          p: 2,
          maxWidth: 600,
          mx: 'auto',
          opacity: 0.9,
          backgroundColor: 'transparent',
          boxShadow: 'none'
        }}>
        <Bar data={chartData} options={chartOptions} />
      </Paper>
    </Box>
  );
};

export default ChartSection;