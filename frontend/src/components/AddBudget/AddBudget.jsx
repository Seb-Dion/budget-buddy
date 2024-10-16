import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './AddBudget.module.css';
import Sidebar from '../Sidebar/Sidebar';

const AddBudget = () => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [month, setMonth] = useState('');

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('User is not authenticated.');
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

      toast.success('Budget added successfully!');
      setCategory('');
      setLimit('');
      setMonth('');
    } catch (error) {
      console.error('Error adding budget:', error.response ? error.response.data : error.message);
      toast.error('Failed to add budget. Please try again.');
    }
  };

  return (
    <div className={styles.addBudgetContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <ToastContainer /> {/* Added ToastContainer */}
        <header className={styles.header}>
          <h1>Add Budget</h1>
        </header>
        <form onSubmit={handleAddBudget} className={styles.form}>
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
