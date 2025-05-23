import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/*
  This Login component handles:
  - Authentication via POST request to /api/auth/login
  - Stores JWT token and userId in localStorage
  - On login success, navigates to /dashboard
  - On failure, clears any existing token/userId for safety
*/

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://daily-tracker-api.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        if (!data.id || !data.token) {
          alert('Login failed: Missing user ID or token from server.');
          localStorage.removeItem('userId');
          localStorage.removeItem('token');
          return;
        }

        localStorage.setItem('userId', data.id);
        localStorage.setItem('token', data.token);

        alert(`Login successful! Welcome, ${data.username || data.email || ''}`);
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.error || 'Unknown error'}`);
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
      }
    } catch (error) {
      alert('Login failed: Network error');
      console.error(error);
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Login to Your Account</h2>
      <p style={styles.subtitle}>
        Welcome back! Please enter your credentials to continue.
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.loginButton}>
          Login
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    color: '#222',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  form: {
    maxWidth: 320,
    margin: '0 auto 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  input: {
    padding: '12px',
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
    outline: 'none',
  },
  loginButton: {
    padding: '12px',
    fontSize: 16,
    backgroundColor: '#4caf50',
    border: 'none',
    borderRadius: 4,
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
  },
};
