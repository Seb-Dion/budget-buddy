import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMoneyBillWave, FaTrash, FaRegCalendarAlt } from 'react-icons/fa';
import styles from './IncomeList.module.css';
import Sidebar from '../Sidebar/Sidebar';

const IncomeList = () => {
  const [incomes, setIncomes] = useState([]);
  const [groupedIncomes, setGroupedIncomes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/budget/income', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIncomes(response.data.income);
        groupByCategory(response.data.income);
      } catch (error) {
        console.error('Error fetching income:', error);
        toast.error('Failed to fetch income');
      }
    };

    fetchIncomes();
  }, []);

  const groupByCategory = (income) => {
    const grouped = income.reduce((acc, inc) => {
      if (!acc[inc.source]) {
        acc[inc.source] = {
          total: 0,
          items: []
        };
      }
      acc[inc.source].total += inc.amount;
      acc[inc.source].items.push(inc);
      return acc;
    }, {});
    setGroupedIncomes(grouped);
  };

  const handleDeleteIncome = async (incomeId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/budget/income/${incomeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncomes(incomes.filter(inc => inc.id !== incomeId));
      groupByCategory(incomes.filter(inc => inc.id !== incomeId));
      toast.success('Income deleted successfully!');
    } catch (error) {
      console.error('Error deleting income:', error);
      toast.error('Failed to delete income');
    }
  };

  const handleAddIncome = () => {
    navigate('/add-income');
  };

  return (
    <div className={styles.incomeListContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Income Tracker</h1>
            <p className={styles.subtitle}>Manage and monitor your income sources</p>
          </div>
          <button onClick={handleAddIncome} className={styles.addButton}>
            <FaPlus className={styles.buttonIcon} />
            Add Income
          </button>
        </header>

        {Object.keys(groupedIncomes).length === 0 ? (
          <div className={styles.emptyState}>
            <FaMoneyBillWave className={styles.emptyIcon} />
            <h3>No Income Records</h3>
            <p>Start tracking your income by adding your first record</p>
            <button onClick={handleAddIncome} className={styles.emptyButton}>
              Add Your First Income
            </button>
          </div>
        ) : (
          <div className={styles.incomeGrid}>
            {Object.entries(groupedIncomes).map(([source, data]) => (
              <div key={source} className={styles.incomeCard}>
                <div className={styles.cardHeader}>
                  <h3>{source}</h3>
                  <div className={styles.totalAmount}>
                    ${data.total.toFixed(2)}
                  </div>
                </div>
                
                <div className={styles.incomeList}>
                  {data.items.map((income) => (
                    <div key={income.id} className={styles.incomeItem}>
                      <div className={styles.incomeDetails}>
                        <div className={styles.amount}>
                          ${income.amount.toFixed(2)}
                        </div>
                        <div className={styles.date}>
                          <FaRegCalendarAlt className={styles.dateIcon} />
                          {new Date(income.date).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteIncome(income.id)}
                        className={styles.deleteButton}
                        aria-label="Delete income"
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

export default IncomeList;
