import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { FaUser, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';

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
                    <p className={styles.tagline}>Smart money management starts here</p>
                    
                    <div className={styles.features}>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>📊</div>
                            <div className={styles.featureText}>
                                <h3>Track Expenses</h3>
                                <p>Monitor your spending habits with ease</p>
                            </div>
                        </div>
                        
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>💰</div>
                            <div className={styles.featureText}>
                                <h3>Set Budgets</h3>
                                <p>Create and manage custom budgets</p>
                            </div>
                        </div>
                        
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>📈</div>
                            <div className={styles.featureText}>
                                <h3>Visual Insights</h3>
                                <p>See your finances through clear visualizations</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.formContainer}>
                <div className={styles.formWrapper}>
                    <h2 className={styles.formTitle}>
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className={styles.formSubtitle}>
                        {isSignUp 
                            ? 'Start your journey to better financial management' 
                            : 'Sign in to continue to your dashboard'}
                    </p>

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
