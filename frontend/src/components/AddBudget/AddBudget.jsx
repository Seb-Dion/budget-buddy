import React, { useState } from 'react';
import axios from 'axios';
import styles from './AddBudget.module.css';
import Sidebar from '../Sidebar/Sidebar';

const AddBudget = () => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [month, setMonth] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated.');
        return;
      }

      await axios.post(
        '/budget/budget',
        {
          category,
          limit: parseFloat(limit),
          month,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage('Budget added successfully!');
      setCategory('');
      setLimit('');
      setMonth('');
    } catch (error) {
      console.error('Error adding budget:', error.response ? error.response.data : error.message);
      setErrorMessage('Failed to add budget. Please try again.');
    }
  };

  return (
    <div className={styles.addBudgetContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Add Budget</h1>
        </header>
        <form onSubmit={handleAddBudget} className={styles.form}>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="number"
            placeholder="Limit"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>Add Budget</button>
        </form>
      </main>
    </div>
  );
};

export default AddBudget;
