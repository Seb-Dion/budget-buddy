import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
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
          <h1>Your Income</h1>
        </header>
        <button onClick={handleAddIncome} className={styles.addButton}>
          Add Income
        </button>
        {Object.keys(groupedIncomes).length === 0 ? (
          <p>No income records found.</p>
        ) : (
          <div className={styles.groupedIncomeList}>
            {Object.keys(groupedIncomes).map(category => (
              <div key={category} className={styles.categoryGroup}>
                <h3>{category} - Total: ${groupedIncomes[category].total.toFixed(2)}</h3>
                <ul className={styles.incomeItems}>
                  {groupedIncomes[category].items.map(inc => (
                    <li key={inc.id} className={styles.incomeItem}>
                      <strong>Amount:</strong> ${inc.amount.toFixed(2)} <br />
                      <strong>Date:</strong> {inc.date} <br />
                      <button
                        onClick={() => handleDeleteIncome(inc.id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
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

export default IncomeList;
