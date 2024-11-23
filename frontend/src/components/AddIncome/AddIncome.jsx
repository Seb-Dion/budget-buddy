import React, { useState } from 'react';
import axios from 'axios';
import { formatDate } from '../../utils/helpers';
import { FaMoneyBillWave, FaDollarSign, FaCalendar } from 'react-icons/fa';
import styles from './AddIncome.module.css';
import Sidebar from '../Sidebar/Sidebar';

const AddIncome = () => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleAddIncome = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ text: "Please log in again", type: "error" });
        return;
      }

      if (!source || !amount || !date) {
        setMessage({ text: "Please fill in all fields", type: "error" });
        return;
      }

      const formattedDate = formatDate(date);

      const response = await axios.post(
        "/budget/income",
        { 
          source, 
          amount: parseFloat(amount), 
          date: formattedDate 
        },
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSource("");
        setAmount("");
        setDate("");
        setMessage({ text: "Income added successfully!", type: "success" });
        
        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 3000);
      }

    } catch (error) {
      console.error("Error:", error);
      setMessage({ text: "Failed to add income", type: "error" });
    }
  };

  return (
    <div className={styles.addIncomeContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className={styles.formContainer}>
          <h2>Add Income</h2>
          
          {message.text && (
            <div 
              className={`${styles.message} ${
                message.type === 'success' ? styles.success : styles.error
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleAddIncome}>
            <div className={styles.formCard}>
              <div className={styles.formIcon}>
                <FaMoneyBillWave />
              </div>
              
              <div className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="source">Income Source</label>
                  <div className={styles.inputWrapper}>
                    <FaMoneyBillWave className={styles.inputIcon} />
                    <input
                      id="source"
                      type="text"
                      placeholder="e.g., Salary, Freelance, Investment"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="amount">Amount</label>
                  <div className={styles.inputWrapper}>
                    <FaDollarSign className={styles.inputIcon} />
                    <input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={styles.input}
                      required
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="date">Date Received</label>
                  <div className={styles.inputWrapper}>
                    <FaCalendar className={styles.inputIcon} />
                    <input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className={styles.submitButton}>
                  Add Income Record
                </button>
              </div>
            </div>

            <div className={styles.formTips}>
              <h3>Tips for Income Tracking</h3>
              <ul>
                <li>Be specific with your income sources for better tracking</li>
                <li>Include all types of income: regular and one-time payments</li>
                <li>Use the actual date when the income was received</li>
              </ul>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddIncome;
