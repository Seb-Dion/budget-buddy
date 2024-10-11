import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import styles from './TopSpendingCategories.module.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopSpendingCategories = () => {
  const [topCategories, setTopCategories] = useState([]);

  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const expensesResponse = await axios.get('/budget/expenses', { headers });
        const expenses = expensesResponse.data.expenses;

        const categoryTotals = expenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {});

        const sortedCategories = Object.entries(categoryTotals)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5);

        setTopCategories(sortedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchTopCategories();
  }, []);

  const barData = {
    labels: topCategories.map(([category]) => category),
    datasets: [
      {
        label: 'Spending by Category',
        data: topCategories.map(([, amount]) => amount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={styles.barChartContainer}>
      <h2>Top Spending Categories</h2>
      <Bar data={barData} options={barOptions} />
    </div>
  );
};

export default TopSpendingCategories;
