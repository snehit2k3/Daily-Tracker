import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Daily Tracker</h1>
      <p style={styles.subtitle}>Track your daily tasks, moods, and productivity effortlessly.</p>
      <div style={styles.buttonContainer}>
        <button
          onClick={() => navigate('/login')}
          style={{ ...styles.button, ...styles.loginButton }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          style={{ ...styles.button, ...styles.signupButton }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Signup
        </button>
      </div>
      <footer style={styles.footer}>© 2025 Daily Tracker. All rights reserved.</footer>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'radial-gradient(circle at center, #667eea 0%, #764ba2 90%)',
    color: 'white',
    textAlign: 'center',
    padding: '0 25px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative',
  },
  title: {
    fontSize: '3.5rem',
    marginBottom: '0.7rem',
    fontWeight: '800',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
  },
  subtitle: {
    fontSize: '1.4rem',
    marginBottom: '3rem',
    fontWeight: '500',
    opacity: 0.9,
    maxWidth: '500px',
    lineHeight: '1.5',
    textShadow: '0 2px 6px rgba(0,0,0,0.3)',
  },
  buttonContainer: {
    display: 'flex',
    gap: '25px',
  },
  button: {
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    padding: '14px 38px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    fontWeight: '600',
    letterSpacing: '0.05em',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.6)',
  },
  signupButton: {
    backgroundColor: '#2196F3',
    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.6)',
  },
  footer: {
    position: 'absolute',
    bottom: '15px',
    fontSize: '0.9rem',
    opacity: 0.6,
    fontWeight: '400',
    userSelect: 'none',
  },
};
