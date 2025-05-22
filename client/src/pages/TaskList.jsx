import React from 'react';

export default function TaskList({ tasks, onToggleComplete }) {
  if (!tasks.length) return <p>No tasks for today.</p>;

  return (
    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      {tasks.map((task) => (
        <li
          key={task.id}
          style={{
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #ddd',
            padding: '10px 15px',
            borderRadius: '8px',
            background: task.completed ? '#e0ffe0' : '#fff',
          }}
        >
          <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.title}
          </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task)}
            />
            <span className="slider round"></span>
          </label>
        </li>
      ))}
    </ul>
  );
}
