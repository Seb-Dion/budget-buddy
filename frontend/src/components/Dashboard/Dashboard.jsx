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

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const expensesResponse = await axios.get('/budget/expenses', { headers });
      const incomeResponse = await axios.get('/budget/income', { headers });
      const budgetResponse = await axios.get('/budget/total', { headers });
      const cashFlowResponse = await axios.get('/budget/cash-flow', { headers });

      const expenses = expensesResponse.data.expenses.map(exp => ({ ...exp, type: 'expense' }));
      const income = incomeResponse.data.income.map(inc => ({ ...inc, type: 'income' }));

      const transactions = [...expenses, ...income].sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentTransactions(transactions.slice(0, 3));

      setBudgetUsed(budgetResponse.data.used);
      setBudgetTotal(budgetResponse.data.total);
      setCashFlow(cashFlowResponse.data.cash_flow);

      if (budgetResponse.data.used >= 0.8 * budgetResponse.data.total && budgetResponse.data.used < budgetResponse.data.total) {
        toast.warning("You are close to your budget limit!");
      } else if (budgetResponse.data.used >= budgetResponse.data.total) {
        toast.error("You have exceeded your budget!");
      }
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

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <ToastContainer />
        <header className={styles.header}>
          <h1>Dashboard</h1>
        </header>
        {loading ? (
          <div className={styles.spinner}></div>
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
            <div className={styles.graphAndBalanceContainer}>
              <section className={styles.barChartSection}>
                <TopSpendingCategories />
              </section>
              <section className={styles.balanceSection}>
                <h2>{getMonthName()}'s Balance</h2>
                <p className={`${styles.cashFlow} ${cashFlow >= 0 ? styles.positive : styles.negative}`}>
                  ${cashFlow.toFixed(2)}
                </p>
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
