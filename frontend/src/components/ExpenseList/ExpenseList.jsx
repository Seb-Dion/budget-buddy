import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaTags } from 'react-icons/fa';
import styles from './ExpenseList.module.css';
import Sidebar from '../Sidebar/Sidebar';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/budget/expenses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses(response.data.expenses);
        groupByCategory(response.data.expenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        toast.error('Failed to fetch expenses');
      }
    };

    fetchExpenses();
  }, []);

  const groupByCategory = (expenses) => {
    const grouped = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = {
          total: 0,
          items: []
        };
      }
      acc[expense.category].total += expense.amount;
      acc[expense.category].items.push(expense);
      return acc;
    }, {});
    setGroupedExpenses(grouped);
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/budget/expenses/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter(exp => exp.id !== expenseId));
      groupByCategory(expenses.filter(exp => exp.id !== expenseId));
      toast.success('Expense deleted successfully!');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const handleAddExpense = () => {
    navigate('/add-expense');
  };

  return (
    <div className={styles.expenseListContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Expenses</h1>
            <p className={styles.subtitle}>Manage your expenses by category</p>
          </div>
          <button onClick={handleAddExpense} className={styles.addButton}>
            <FaPlus className={styles.buttonIcon} />
            Add Expense
          </button>
        </header>

        {Object.keys(groupedExpenses).length === 0 ? (
          <div className={styles.emptyState}>
            <FaTags className={styles.emptyIcon} />
            <p>No expenses found.</p>
            <button onClick={handleAddExpense} className={styles.emptyButton}>
              Add Your First Expense
            </button>
          </div>
        ) : (
          <div className={styles.groupedExpenseList}>
            {Object.keys(groupedExpenses).map(category => (
              <div key={category} className={styles.categoryGroup}>
                <div className={styles.categoryHeader}>
                  <h3>
                    <span className={styles.categoryName}>{category}</span>
                    <span className={styles.categoryTotal}>
                      ${groupedExpenses[category].total.toFixed(2)}
                    </span>
                  </h3>
                </div>
                <div className={styles.expenseItems}>
                  {groupedExpenses[category].items.map(expense => (
                    <div key={expense.id} className={styles.expenseItem}>
                      <div className={styles.expenseInfo}>
                        <div className={styles.expenseAmount}>
                          ${expense.amount.toFixed(2)}
                        </div>
                        <div className={styles.expenseDate}>
                          {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className={styles.deleteButton}
                        aria-label="Delete expense"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExpenseList;
