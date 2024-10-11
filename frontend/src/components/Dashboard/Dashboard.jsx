import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';
import Sidebar from '../Sidebar/Sidebar';
import TopSpendingCategories from '../TopSpendingCategories/TopSpendingCategories';

const Dashboard = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgetUsed, setBudgetUsed] = useState(0);
  const [budgetTotal, setBudgetTotal] = useState(0);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch expenses and budget data
      const expensesResponse = await axios.get('/budget/expenses', { headers });
      const budgetResponse = await axios.get('/budget/total', { headers });

      const expenses = expensesResponse.data.expenses;
      setRecentTransactions(expenses.slice(0, 3));
      setBudgetUsed(budgetResponse.data.used);
      setBudgetTotal(budgetResponse.data.total);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Dashboard</h1>
        </header>
        <section className={styles.transactionsSection}>
          <h2>Recent Transactions</h2>
          <div className={styles.transactionCards}>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <div key={index} className={styles.transactionCard}>
                  <p>${transaction.amount.toFixed(2)}</p>
                  <span className={transaction.amount > 0 ? styles.income : styles.expense}>
                    {transaction.category}
                  </span>
                </div>
              ))
            ) : (
              <p>No recent transactions found.</p>
            )}
          </div>
        </section>
        <section className={styles.barChartSection}>
          <TopSpendingCategories />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
