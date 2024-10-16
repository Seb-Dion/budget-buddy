import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import styles from './AddIncome.module.css';
import Sidebar from '../Sidebar/Sidebar';

const AddIncome = () => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('User is not authenticated.');
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

      toast.success('Income added successfully!'); // Show success toast
      setSource('');
      setAmount('');
      setDate('');
    } catch (error) {
      console.error('Error adding income:', error.response ? error.response.data : error.message);
      toast.error('Failed to add income. Please try again.'); // Show error toast
    }
  };

  return (
    <div className={styles.addIncomeContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <ToastContainer /> {/* Add ToastContainer for notifications */}
        <header className={styles.header}>
          <h1>Add Income</h1>
        </header>
        <form onSubmit={handleAddIncome} className={styles.form}>
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
