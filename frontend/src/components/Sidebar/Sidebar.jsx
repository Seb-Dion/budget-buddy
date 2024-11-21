import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
import profileImage from '../../assets/Dashboard/avatar-generic.png';
import { FaHome, FaChartPie, FaWallet, FaDollarSign, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const [userName, setUserName] = useState('User');
  const location = useLocation();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const isActive = (paths) => {
    return paths.includes(location.pathname);
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.logo}>Budget Buddy</h1>
      </div>  

      <div className={styles.profileSection}>
        <img
          src={profileImage}
          alt="Profile"
          className={styles.profileImage}
        />
        <div className={styles.profileInfo}>
          <div className={styles.userName}>{userName}</div>
          <div className={styles.userStatus}>Active</div>
        </div>
      </div>

      <nav className={styles.navLinks}>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <FaHome className={styles.icon} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/expenses"
          className={() => `${styles.navLink} ${isActive(['/expenses', '/add-expense']) ? styles.active : ''}`}
        >
          <FaChartPie className={styles.icon} />
          <span>Expenses</span>
        </NavLink>

        <NavLink
          to="/income"
          className={() => `${styles.navLink} ${isActive(['/add-income', '/income']) ? styles.active : ''}`}
        >
          <FaWallet className={styles.icon} />
          <span>Income</span>
        </NavLink>

        <NavLink
          to="/budgets"
          className={() => `${styles.navLink} ${isActive(['/add-budget', '/budgets']) ? styles.active : ''}`}
        >
          <FaDollarSign className={styles.icon} />
          <span>Budget</span>
        </NavLink>
      </nav>

      <div className={styles.sidebarFooter}>
        <NavLink to="/login" className={styles.signOutLink}>
          <FaSignOutAlt className={styles.icon} />
          <span>Sign out</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
