import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './BudgetList.module.css';
import Sidebar from '../Sidebar/Sidebar';

const BudgetList = () => {
  const [budgets, setBudgets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/budget/budgets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBudgets(response.data.budgets);
      } catch (error) {
        console.error('Error fetching budgets:', error);
        alert('Failed to fetch budgets');
      }
    };

    fetchBudgets();
  }, []);

  const handleAddBudget = () => {
    navigate('/add-budget');
  };

  return (
    <div className={styles.budgetListContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Your Budgets</h1>
        </header>
        <button onClick={handleAddBudget} className={styles.addButton}>
          Add Budget
        </button>
        {budgets.length === 0 ? (
          <p>No budgets found.</p>
        ) : (
          <div className={styles.budgetList}>
            {budgets.map((budget) => (
              <div key={budget.id} className={styles.budgetItem}>
                <h3>{budget.category} - ${budget.limit}</h3>
                <p>Month: {budget.month}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BudgetList;
