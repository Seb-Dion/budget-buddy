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
  
      // Fetch all data
      const expensesResponse = await axios.get('/budget/expenses', { headers });
      const incomeResponse = await axios.get('/budget/income', { headers });
      const budgetsResponse = await axios.get('/budget/budgets', { headers });
      const cashFlowResponse = await axios.get('/budget/cash-flow', { headers });
  
      // Get current month's data for calculations
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
      // Format all transactions with type
      const allExpenses = expensesResponse.data.expenses.map(exp => ({
        ...exp,
        type: 'expense',
        amount: exp.amount,
        date: new Date(exp.date)
      }));
  
      const allIncome = incomeResponse.data.income.map(inc => ({
        ...inc,
        type: 'income',
        amount: inc.amount,
        date: new Date(inc.date)
      }));
  
      // Combine and sort all transactions
      const allTransactions = [...allExpenses, ...allIncome]
        .sort((a, b) => b.date - a.date)
        .slice(0, 3);  // Get only the 3 most recent
  
      setRecentTransactions(allTransactions);
  
      // Calculate total budget for current month
      const totalBudget = budgetsResponse.data.budgets.reduce((sum, budget) => 
        sum + budget.limit, 0
      );
      setBudgetTotal(totalBudget);
  
      // Calculate total spent for current month
      const totalSpent = allExpenses.reduce((sum, expense) => 
        sum + expense.amount, 0
      );
      setBudgetUsed(totalSpent);
  
      // Calculate budget usage for current month
      const budgetUsage = {};
      allExpenses.forEach(exp => {
        if (!budgetUsage[exp.category]) {
          budgetUsage[exp.category] = 0;
        }
        budgetUsage[exp.category] += exp.amount;
      });
  
      // Set remaining state
      setBudgets(budgetsResponse.data.budgets);
      setBudgetUsage(budgetUsage);
      setCashFlow(cashFlowResponse.data.cash_flow);
  
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch dashboard data');
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
