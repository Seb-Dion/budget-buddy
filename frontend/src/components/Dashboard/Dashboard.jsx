import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';
import Sidebar from '../Sidebar/Sidebar';
import TopSpendingCategories from '../TopSpendingCategories/TopSpendingCategories';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgetUsed, setBudgetUsed] = useState(0);
  const [budgetTotal, setBudgetTotal] = useState(0);
  const [cashFlow, setCashFlow] = useState(0);
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  const [budgetUsage, setBudgetUsage] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
  
      // Fetch data from the backend
      const expensesResponse = await axios.get('/budget/expenses', { headers });
      const incomeResponse = await axios.get('/budget/income', { headers });
      const budgetsResponse = await axios.get('/budget/budgets', { headers });
      const cashFlowResponse = await axios.get('/budget/cash-flow', { headers });
  
      // Get expenses and income
      const expenses = expensesResponse.data.expenses.map(exp => ({ ...exp, type: 'expense' }));
      const income = incomeResponse.data.income.map(inc => ({ ...inc, type: 'income' }));
  
      // Combine and sort transactions
      const transactions = [...expenses, ...income].sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentTransactions(transactions.slice(0, 3));
  
      // Calculate total used budget for each category
      const budgetUsage = {};
      expenses.forEach(exp => {
        if (!budgetUsage[exp.category]) {
          budgetUsage[exp.category] = 0;
        }
        budgetUsage[exp.category] += exp.amount;
      });
  
      // Store budget data in state instead of showing notifications
      setBudgets(budgetsResponse.data.budgets);
      setBudgetUsage(budgetUsage);
  
      setCashFlow(cashFlowResponse.data.cash_flow);
  
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = () => {
    const date = new Date();
    return date.toLocaleString('default', { month: 'long' });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    budgets.forEach(budget => {
      const spent = budgetUsage[budget.category] || 0;
      if (spent >= 0.8 * budget.limit && spent < budget.limit) {
        toast.warning(`You're close to your budget limit in ${budget.category}!`);
      } else if (spent >= budget.limit) {
        toast.error(`You have exceeded your budget in ${budget.category}!`);
      }
    });
  }, [budgets, budgetUsage]); // Only run when budget data changes

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <ToastContainer theme="dark" />
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Welcome Back</h1>
            <p className={styles.subtitle}>{getMonthName()}'s Overview</p>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.addButton}>
              <span>+</span> Add Transaction
            </button>
          </div>
        </header>

        {loading ? (
          <div className={styles.spinner}></div>
        ) : (
          <>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>💰</div>
                <div className={styles.statInfo}>
                  <h3>Cash Flow</h3>
                  <p className={`${styles.statAmount} ${cashFlow >= 0 ? styles.positive : styles.negative}`}>
                    ${Math.abs(cashFlow).toFixed(2)}
                    <span className={styles.indicator}>{cashFlow >= 0 ? '↑' : '↓'}</span>
                  </p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>📊</div>
                <div className={styles.statInfo}>
                  <h3>Total Budget</h3>
                  <p className={styles.statAmount}>
                    ${budgetTotal.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>💳</div>
                <div className={styles.statInfo}>
                  <h3>Total Spent</h3>
                  <p className={styles.statAmount}>
                    ${budgetUsed.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.mainGrid}>
              <section className={styles.transactionsSection}>
                <div className={styles.sectionHeader}>
                  <h2>Recent Transactions</h2>
                  <button className={styles.viewAllButton}>View All</button>
                </div>
                <div className={styles.transactionsList}>
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction, index) => (
                      <div key={index} className={styles.transactionItem}>
                        <div className={styles.transactionIcon}>
                          {transaction.type === 'income' ? '↑' : '↓'}
                        </div>
                        <div className={styles.transactionDetails}>
                          <h4>{transaction.type === 'income' ? transaction.source : transaction.category}</h4>
                          <p className={styles.transactionDate}>
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`${styles.transactionAmount} ${transaction.type === 'income' ? styles.income : styles.expense}`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className={styles.noData}>No recent transactions found.</p>
                  )}
                </div>
              </section>

              <section className={styles.chartsSection}>
                <div className={styles.sectionHeader}>
                  <h2>Spending Overview</h2>
                </div>
                <TopSpendingCategories />
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
