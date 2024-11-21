import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaMoneyBillWave, FaDollarSign, FaCalendar } from 'react-icons/fa';
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
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Add Income</h1>
            <p className={styles.subtitle}>Record your earnings and keep track of your income sources</p>
          </div>
        </header>

        <div className={styles.formCard}>
          <div className={styles.formIcon}>
            <FaMoneyBillWave />
          </div>
          
          <form onSubmit={handleAddIncome} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="source">Income Source</label>
              <div className={styles.inputWrapper}>
                <FaMoneyBillWave className={styles.inputIcon} />
                <input
                  id="source"
                  type="text"
                  placeholder="e.g., Salary, Freelance, Investment"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="amount">Amount</label>
              <div className={styles.inputWrapper}>
                <FaDollarSign className={styles.inputIcon} />
                <input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={styles.input}
                  required
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="date">Date Received</label>
              <div className={styles.inputWrapper}>
                <FaCalendar className={styles.inputIcon} />
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              Add Income Record
            </button>
          </form>

          <div className={styles.formTips}>
            <h3>Tips for Income Tracking</h3>
            <ul>
              <li>Be specific with your income sources for better tracking</li>
              <li>Include all types of income: regular and one-time payments</li>
              <li>Use the actual date when the income was received</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddIncome;
