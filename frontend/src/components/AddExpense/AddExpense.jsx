import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaReceipt, FaDollarSign, FaCalendar, FaTags } from "react-icons/fa";
import styles from "./AddExpense.module.css";
import Sidebar from "../Sidebar/Sidebar";

const AddExpense = () => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/budget/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const uniqueCategories = [
          ...new Set(response.data.expenses.map((exp) => exp.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User is not authenticated.");
        return;
      }
      const response = await axios.post(
        "/budget/expenses",
        { category, amount: parseFloat(amount), date },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Show appropriate messages based on budget status
      if (response.data.status === "over_budget") {
        toast.warning(response.data.message);
      } else if (response.data.status === "close_to_budget") {
        toast.info(response.data.message);
      } else {
        toast.success(response.data.message);
      }

      setCategory("");
      setAmount("");
      setDate("");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense. Please try again.");
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    const filtered = categories.filter((cat) =>
      cat.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleSelectCategory = (selectedCategory) => {
    setCategory(selectedCategory);
    setFilteredCategories([]);
  };

  return (
    <div className={styles.addExpenseContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Add Expense</h1>
            <p className={styles.subtitle}>Track your spending by adding a new expense</p>
          </div>
        </header>

        <div className={styles.formCard}>
          <form onSubmit={handleAddExpense} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="category">Category</label>
              <div className={styles.inputWrapper}>
                <FaTags className={styles.inputIcon} />
                <input
                  id="category"
                  type="text"
                  placeholder="Enter or select category"
                  value={category}
                  onChange={handleCategoryChange}
                  className={styles.input}
                  required
                />
              </div>
              {filteredCategories.length > 0 && (
                <ul className={styles.dropdownList}>
                  {filteredCategories.map((cat, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectCategory(cat)}
                      className={styles.dropdownItem}
                    >
                      <FaReceipt className={styles.dropdownIcon} />
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
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
              <label htmlFor="date">Date</label>
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
              Add Expense
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddExpense;
