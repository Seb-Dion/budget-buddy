import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import styles from './BudgetList.module.css';
import Sidebar from '../Sidebar/Sidebar';

const BudgetList = () => {
  const [budgets, setBudgets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/budget/budgets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets(response.data.budgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast.error('Failed to fetch budgets');
    }
  };

  const handleAddBudget = () => {
    navigate('/add-budget');
  };

  // Function to delete a budget
  const handleDeleteBudget = async (budgetId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/budget/budget/${budgetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove the deleted budget from the list
      setBudgets(budgets.filter(budget => budget.id !== budgetId));
      toast.success('Budget deleted successfully!'); // Show success toast
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget'); // Show error toast
    }
  };

  return (
    <div className={styles.budgetListContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <ToastContainer /> {/* Add ToastContainer for notifications */}
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
                <button
                  onClick={() => handleDeleteBudget(budget.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BudgetList;
