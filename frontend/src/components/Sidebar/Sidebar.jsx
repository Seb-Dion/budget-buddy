import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
import profileImage from '../../assets/Dashboard/avatar-generic.png';
import arrowIcon from '../../assets/arrow.png';

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
      <div className={styles.Header}>
        <h1>Budget Buddy</h1>
      </div>  
      <div className={styles.profileSection}>
        <img
          src={profileImage}
          alt="Profile"
          className={styles.profileImage}
        />
        <div className={styles.profileText}>{userName}</div>
      </div>
      <nav className={styles.navLinks}>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          <img src={arrowIcon} alt="Arrow" className={styles.arrowIcon} />
          Dashboard
        </NavLink>
        <NavLink
          to="/expenses"
          className={() => (isActive(['/expenses', '/add-expense']) ? `${styles.navLink} ${styles.active}` : styles.navLink)}
        >
          <img src={arrowIcon} alt="Arrow" className={styles.arrowIcon} />
          Expenses
        </NavLink>
        <NavLink
          to="/income"
          className={() => (isActive(['/add-income', '/income']) ? `${styles.navLink} ${styles.active}` : styles.navLink)}
        >
          <img src={arrowIcon} alt="Arrow" className={styles.arrowIcon} />
          Income
        </NavLink>
        <NavLink
          to="/budgets"
          className={() => (isActive(['/add-budget', '/budgets']) ? `${styles.navLink} ${styles.active}` : styles.navLink)}
        >
          <img src={arrowIcon} alt="Arrow" className={styles.arrowIcon} />
          Budget
        </NavLink>
        <NavLink to="/login" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          <img src={arrowIcon} alt="Arrow" className={styles.arrowIcon} />
          Sign out
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
