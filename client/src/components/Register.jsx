import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        alert('Registered successfully!');
        navigate('/login');
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.error || 'Unknown error'}`);
      }
      
    } catch (error) {
      alert('Registration failed: Network error');
      console.error(error);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Create Your Account</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
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
        <button type="submit" style={styles.registerButton}>
          Register
        </button>
      </form>
    </div>
  );
}

// styles stay same as before
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
    marginBottom: 30,
  },
  form: {
    maxWidth: 320,
    margin: '0 auto',
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
  registerButton: {
    marginTop: 10,
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
