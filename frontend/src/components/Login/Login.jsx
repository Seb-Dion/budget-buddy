import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaChartLine, FaPiggyBank, FaChartBar } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);

    const handleToggle = () => {
        setIsSignUp(!isSignUp);
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isSignUp ? '/auth/register' : '/auth/login';
            const payload = {
                email,
                password,
                ...(isSignUp && { username })
            };

            const response = await axios.post(endpoint, payload);

            if (!isSignUp) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('userName', response.data.username); // Save username
                navigate('/dashboard');
            } else {
                alert("Account created successfully! Please log in.");
                setIsSignUp(false);
                setUsername('');
                setPassword('');
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            setErrorMessage(isSignUp ? 'Sign Up Failed. Please try again.' : 'Login Failed. Please check your credentials.');
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.leftPanel}>
                <div className={styles.brandContent}>
                    <h1 className={styles.logo}>Budget Buddy</h1>
                    <p className={styles.tagline}>Your Financial Journey Starts Here</p>
                    
                    <div className={styles.features}>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>
                                <FaChartLine className={styles.icon} />
                            </div>
                            <div className={styles.featureText}>
                                <h3>Smart Tracking</h3>
                                <p>Real-time insights into your spending patterns</p>
                            </div>
                        </div>
                        
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>
                                <FaPiggyBank className={styles.icon} />
                            </div>
                            <div className={styles.featureText}>
                                <h3>Savings Goals</h3>
                                <p>Set and achieve your financial targets</p>
                            </div>
                        </div>
                        
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>
                                <FaChartBar className={styles.icon} />
                            </div>
                            <div className={styles.featureText}>
                                <h3>Rich Analytics</h3>
                                <p>Beautiful charts and detailed reports</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.formContainer}>
                <div className={styles.formWrapper}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>
                            {isSignUp ? '✨ Create Account' : '👋 Welcome Back'}
                        </h2>
                        <p className={styles.formSubtitle}>
                            {isSignUp 
                                ? 'Begin your journey to financial freedom' 
                                : 'We\'re excited to see you again'}
                        </p>
                    </div>

                    {errorMessage && (
                        <div className={styles.errorMessage}>
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {isSignUp && (
                            <div className={styles.inputGroup}>
                                <FaUser className={styles.inputIcon} />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className={styles.inputGroup}>
                            <FaEnvelope className={styles.inputIcon} />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <FaLock className={styles.inputIcon} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {!isSignUp && (
                            <div className={styles.forgotPassword}>
                                <a href="#">Forgot password?</a>
                            </div>
                        )}

                        <button type="submit" className={styles.submitButton}>
                            {isSignUp ? 'Create Account' : 'Sign In'}
                        </button>

                        <div className={styles.divider}>
                            <span>or continue with</span>
                        </div>

                        <button type="button" className={styles.googleButton}>
                            <FaGoogle />
                            <span>Google</span>
                        </button>
                    </form>

                    <p className={styles.togglePrompt}>
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <button 
                            type="button"
                            onClick={handleToggle}
                            className={styles.toggleButton}
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
