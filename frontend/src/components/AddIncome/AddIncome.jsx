import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AddIncome.module.css';
import Sidebar from '../Sidebar/Sidebar';

const AddIncome = () => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate();

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('User is not authenticated.');
        return;
      }

      await axios.post(
        '/budget/income',
        {
          source,
          amount: parseFloat(amount),
          date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage('Income added successfully!');
      setErrorMessage(''); // Clear error message
      setSource('');
      setAmount('');
      setDate('');
    } catch (error) {
      console.error('Error adding income:', error.response ? error.response.data : error.message);
      setErrorMessage('Failed to add income. Please try again.');
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
          {/* Display Success or Error Messages */}
          {successMessage && <p className={styles.success}>{successMessage}</p>}
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          <input
            type="text"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
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
