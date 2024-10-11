import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
        alert('Failed to fetch expenses');
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

  const handleAddExpense = () => {
    navigate('/add-expense');
  };

  return (
    <div className={styles.expenseListContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Your Expenses</h1>
        </header>
        <button onClick={handleAddExpense} className={styles.addButton}>
          Add Expense
        </button>
        {Object.keys(groupedExpenses).length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <div className={styles.groupedExpenseList}>
            {Object.keys(groupedExpenses).map(category => (
              <div key={category} className={styles.categoryGroup}>
                <h3>{category} - Total: ${groupedExpenses[category].total.toFixed(2)}</h3>
                <ul className={styles.expenseItems}>
                  {groupedExpenses[category].items.map(expense => (
                    <li key={expense.id} className={styles.expenseItem}>
                      <strong>Amount:</strong> ${expense.amount.toFixed(2)} <br />
                      <strong>Date:</strong> {expense.date}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExpenseList;
