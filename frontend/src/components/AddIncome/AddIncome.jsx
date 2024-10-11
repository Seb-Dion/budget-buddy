import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AddIncome.module.css';
import Sidebar from '../Sidebar/Sidebar';

const AddIncome = () => {
  const [source, setSource] = useState(''); // Updated to match backend
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated.');
        return;
      }

      const response = await axios.post(
        '/budget/income',
        {
          source, // Updated key to match the backend
          amount: parseFloat(amount),
          date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Income added successfully!');
      setSource('');
      setAmount('');
      setDate('');
      navigate('/income');
    } catch (error) {
      console.error('Error adding income:', error.response ? error.response.data : error.message);
      alert('Failed to add income. Please make sure you are authenticated.');
    }
  };

  return (
    <div className={styles.addIncomeContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Add Income</h1>
        </header>
        <form onSubmit={handleAddIncome} className={styles.form}>
          <input
            type="text"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)} // Updated
            className={styles.input}
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>
            Add Income
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddIncome;
