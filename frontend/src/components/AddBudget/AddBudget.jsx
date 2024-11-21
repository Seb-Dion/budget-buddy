import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPiggyBank, FaTags, FaDollarSign, FaCalendar } from 'react-icons/fa';
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
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Create Budget</h1>
            <p className={styles.subtitle}>Set spending limits for different categories</p>
          </div>
        </header>

        <div className={styles.formCard}>
          <div className={styles.formIcon}>
            <FaPiggyBank />
          </div>
          
          <form onSubmit={handleAddBudget} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="category">Category</label>
              <div className={styles.inputWrapper}>
                <FaTags className={styles.inputIcon} />
                <input
                  id="category"
                  type="text"
                  placeholder="e.g., Groceries, Entertainment, Transport"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <p className={styles.inputHint}>Choose a specific category for better tracking</p>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="limit">Monthly Limit</label>
              <div className={styles.inputWrapper}>
                <FaDollarSign className={styles.inputIcon} />
                <input
                  id="limit"
                  type="number"
                  placeholder="Enter amount"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className={styles.input}
                  required
                  step="0.01"
                  min="0"
                />
              </div>
              <p className={styles.inputHint}>Set a realistic spending limit for this category</p>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="month">Budget Month</label>
              <div className={styles.inputWrapper}>
                <FaCalendar className={styles.inputIcon} />
                <input
                  id="month"
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <p className={styles.inputHint}>Select the month for this budget</p>
            </div>

            <button type="submit" className={styles.submitButton}>
              Create Budget
            </button>
          </form>

          <div className={styles.formTips}>
            <h3>Budget Planning Tips</h3>
            <ul>
              <li>Start with essential categories like housing and utilities</li>
              <li>Consider using the 50/30/20 rule for your overall budget</li>
              <li>Review and adjust your budgets monthly based on spending patterns</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddBudget;
