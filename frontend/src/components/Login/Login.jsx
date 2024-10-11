import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

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
            <div className={styles.title}>Budget Buddy</div>
            <div className={styles.subTitle}>An all in one expense tracker.</div>
            <div className={styles.formContainer}>
                <h2 className={styles.heading}>{isSignUp ? 'Sign Up' : 'Login'}</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    {isSignUp && (
                        <input
                            type="text"
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={styles.input}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <button type="submit" className={styles.button}>
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>
                <p className={styles.toggleText}>
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                    <span onClick={handleToggle} className={styles.toggleLink}>
                        {isSignUp ? 'Login' : 'Sign Up'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
