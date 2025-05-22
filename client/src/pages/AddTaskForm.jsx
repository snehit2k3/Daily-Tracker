import React, { useState } from 'react';

export default function AddTaskForm({ onAddTask }) {
  const [taskName, setTaskName] = useState('');

  const handleClick = () => {
    if (!taskName.trim()) return;
    onAddTask(taskName.trim());
    setTaskName('');
  };

  return (
    <div>
      <input
        type="text"
        placeholder="New task name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: 10 }}
      />
      <button onClick={handleClick} style={{ padding: '8px', width: '100%' }}>
        Add Task
      </button>
    </div>
  );
}
