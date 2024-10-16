import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';
import Sidebar from '../Sidebar/Sidebar';
import TopSpendingCategories from '../TopSpendingCategories/TopSpendingCategories';

const Dashboard = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgetUsed, setBudgetUsed] = useState(0);
  const [budgetTotal, setBudgetTotal] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchData = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
  
      // Fetch expenses and budget data
      const expensesResponse = await axios.get('/budget/expenses', { headers });
      const incomeResponse = await axios.get('/budget/income', { headers });
      const budgetResponse = await axios.get('/budget/total', { headers });
  
      // Set up expenses and income with type information
      const expenses = expensesResponse.data.expenses.map(exp => ({ ...exp, type: 'expense' }));
      const income = incomeResponse.data.income.map(inc => ({ ...inc, type: 'income' }));
  
      // Combine both and sort by date if necessary
      const transactions = [...expenses, ...income].sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentTransactions(transactions.slice(0, 3));
  
      setBudgetUsed(budgetResponse.data.used);
      setBudgetTotal(budgetResponse.data.total);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Set loading to false once fetching is complete
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
        {loading ? (
          <div className={styles.spinner}></div> // Display spinner when loading
        ) : (
          <>
            <section className={styles.transactionsSection}>
              <h2>Recent Transactions</h2>
              <div className={styles.transactionCards}>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction, index) => (
                    <div key={index} className={styles.transactionCard}>
                      <span className={`${transaction.type === 'income' ? styles.income : styles.expense}`}>
                        ${transaction.amount.toFixed(2)}
                      </span>
                      <p className={styles.transactionCategory}>{transaction.type === 'income' ? transaction.source : transaction.category}</p>
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
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
