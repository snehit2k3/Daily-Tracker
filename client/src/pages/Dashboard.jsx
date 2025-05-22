import React, { useEffect, useState } from 'react';
import TaskList from '../pages/TaskList.jsx';
import RatingInput from '../pages/RatingInput.jsx';
import ConsistencyGrid from '../pages/ConsistencyGrid';
import AddTaskForm from '../pages/AddTaskForm';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';  // Import the CSS here

export default function Dashboard() {
  const [userData, setUserData] = useState({});
  const [tasks, setTasks] = useState([]);
  const [rating, setRating] = useState(null);
  const [consistencyData, setConsistencyData] = useState([]);
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('Please login first.');
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user/data', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error(err);
        alert('Error fetching user data. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/tasks?date=${today}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
        alert('Error fetching tasks.');
      }
    };

    const fetchRatings = async () => {
      try {
        const res = await fetch(`/api/ratings?date=${today}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch ratings');
        const data = await res.json();
        setConsistencyData([data]);
        setRating(data.rating);
      } catch (err) {
        console.error(err);
        alert('Error fetching ratings.');
      }
    };

    fetchUserData();
    fetchTasks();
    fetchRatings();
  }, [today, token, navigate]);

  const handleRatingChange = async (newRating) => {
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: newRating, date: today }),
      });
      if (!res.ok) throw new Error('Failed to update rating');
      setRating(newRating);
    } catch (err) {
      console.error(err);
      alert('Error updating rating.');
    }
  };

  const handleAddTask = async (taskName) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: taskName, date: today }),
      });
      if (!res.ok) throw new Error('Failed to create task');
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      console.error(err);
      alert('Error adding task.');
    }
  };

  const handleToggleComplete = async (taskToUpdate) => {
    const updatedStatus = !taskToUpdate.completed;
    try {
      const res = await fetch(`/api/tasks/${taskToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: updatedStatus }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    } catch (err) {
      console.error(err);
      alert('Error updating task.');
    }
  };

  const handleDeleteCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🗓️ Daily Tracker</h1>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>

      <main className="dashboard-grid">
        {/* Scheduled Tasks */}
        <section className="card tasks-card">
          <h2>📋 Scheduled Tasks</h2>
          <TaskList tasks={tasks} onToggleComplete={handleToggleComplete} />
          <button onClick={handleDeleteCompleted} className="btn-danger">
            Delete Completed Tasks
          </button>
        </section>

        {/* Progress & Rating */}
        <section className="card rating-card">
          <h2>📈 Progress & Rating</h2>
          <p className="streak-info">
            <strong>Longest Streak:</strong> {userData.longestStreak || 0} days
          </p>
          <RatingInput rating={rating} onChange={handleRatingChange} />
        </section>

        {/* Add New Task */}
        <section className="card addtask-card">
          <h2>➕ Add New Task</h2>
          <AddTaskForm onAddTask={handleAddTask} />
        </section>

        {/* Daily Consistency Graph */}
        <section className="card consistency-card">
          <h2>📊 Daily Consistency Graph</h2>
          <ConsistencyGrid data={consistencyData} />
        </section>
      </main>
    </div>
  );
}
