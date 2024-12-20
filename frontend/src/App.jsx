import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ExpenseList from './components/ExpenseList/ExpenseList';
import AddExpense from './components/AddExpense/AddExpense';
import IncomeList from './components/IncomeList/IncomeList';
import AddIncome from './components/AddIncome/AddIncome';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import AddBudget from './components/AddBudget/AddBudget';
import BudgetList from './components/BudgetList/BudgetList';

const App = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/income" element={<IncomeList />} />
          <Route path="/add-income" element={<AddIncome />} />
          <Route path="/add-budget" element={<AddBudget />} />
          <Route path="/budgets" element={<BudgetList />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
