import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaPiggyBank, FaTrash, FaChartPie } from 'react-icons/fa';
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

  const calculateProgress = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  return (
    <div className={styles.budgetListContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Budget Overview</h1>
            <p className={styles.subtitle}>Manage your spending limits and track your progress</p>
          </div>
          <button onClick={handleAddBudget} className={styles.addButton}>
            <FaPlus className={styles.buttonIcon} />
            Create Budget
          </button>
        </header>

        {budgets.length === 0 ? (
          <div className={styles.emptyState}>
            <FaPiggyBank className={styles.emptyIcon} />
            <h3>No Budgets Set</h3>
            <p>Start managing your expenses by creating your first budget</p>
            <button onClick={handleAddBudget} className={styles.emptyButton}>
              Create Your First Budget
            </button>
          </div>
        ) : (
          <div className={styles.budgetGrid}>
            {budgets.map((budget) => {
              const progress = calculateProgress(budget.spent || 0, budget.limit);
              const isOverBudget = progress >= 100;

              return (
                <div key={budget.id} className={styles.budgetCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.categoryIcon}>
                      <FaChartPie />
                    </div>
                    <div className={styles.categoryInfo}>
                      <h3>{budget.category}</h3>
                      <p className={styles.monthLabel}>{budget.month}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteBudget(budget.id)}
                      className={styles.deleteButton}
                      aria-label="Delete budget"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className={styles.budgetDetails}>
                    <div className={styles.amounts}>
                      <div className={styles.spent}>
                        <span className={styles.label}>Spent</span>
                        <span className={styles.value}>
                          ${budget.spent?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      <div className={styles.limit}>
                        <span className={styles.label}>Limit</span>
                        <span className={styles.value}>${budget.limit.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className={styles.progressContainer}>
                      <div 
                        className={`${styles.progressBar} ${isOverBudget ? styles.overBudget : ''}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className={styles.progressLabel}>
                      <span>{progress.toFixed(1)}% used</span>
                      {isOverBudget && (
                        <span className={styles.overBudgetLabel}>Over Budget!</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default BudgetList;
