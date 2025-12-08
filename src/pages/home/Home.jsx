import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Pencil } from 'lucide-react';
import './Home.css';
export default function DragDropBoard() {

  // All tasks from db.json
  const [tasks, setTasks] = useState([]);

  const [draggedItem, setDraggedItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  // Load tasks from json-server
  useEffect(() => {
    fetch('http://localhost:3001/tasks')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  // Group tasks by status
const columns = {
  todo: {
    title: 'To Do',
    tasks: tasks.filter(t => t.status === 'todo')
  },
  inProgress: {
    title: 'In Progress',
    tasks: tasks.filter(t => t.status === 'inProgress')
  },
  done: {
    title: 'Done',
    tasks: tasks.filter(t => t.status === 'done')
  }
};


  const handleDragStart = (e, columnId, taskId) => {
    setDraggedItem({ columnId, taskId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Save change when dropping
  const handleDrop = async (e, targetColumnId) => {
    e.preventDefault();

    if (!draggedItem) return;

    const { taskId } = draggedItem;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask = {
      ...task,
      status: targetColumnId
    };

    // Update in db.json
    await fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    });

    // Update local state
    setTasks(prev =>
      prev.map(t => t.id === taskId ? updatedTask : t)
    );

    setDraggedItem(null);
  };

  // Add task to db.json
  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      title: newTaskTitle,
      description: newTaskDescription,
      priority: newTaskPriority,
      status: 'todo'
    };

    const res = await fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });

    const savedTask = await res.json();

    setTasks(prev => [...prev, savedTask]);

    setShowPopup(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
  };

  // Delete from db.json
 // Move task to Corbeille (soft delete)
const deleteTask = async (taskId) => {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  const updatedTask = {
    ...task,
    status: "corbeille"
  };

  // Update the task in db.json
  await fetch(`http://localhost:3001/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTask)
  });

  // Update state without removing it completely
  setTasks(prev =>
    prev.map(t => (t.id === taskId ? updatedTask : t))
  );
};


  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'None';
    }
  };

  return (
    <div className="board-page">
      <div className="board-container">

        <div className="board-header">
          <button className="trash-board-btn">🗑️ Corbeille</button>

          <button onClick={() => setShowPopup(true)} className="add-btn">
            <Plus size={20} />
            Add Task
          </button>
        </div>

        <div className="columns">
          {Object.entries(columns).map(([columnId, column]) => (
            <div
              key={columnId}
              className="column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, columnId)}
            >
              <div className="column-title">
                {column.title}
                <span className="task-count">{column.tasks.length}</span>
              </div>

              <div className="tasks">
                {column.tasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, columnId, task.id)}
                    className="task-card"
                  >
                    <div className="task-top">
                       <button className="task-action-btn">
                       <Pencil size={16} />
                      </button>
                      <div className="task-text">
                        <h3>{task.title}</h3>
                        {task.description && <p>{task.description}</p>}
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="delete-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <span className={`priority ${task.priority}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">
              <h2>Add New Task</h2>
              <button onClick={() => setShowPopup(false)}>
                <X size={22} />
              </button>
            </div>

            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title..."
              className="input"
            />

            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Task description..."
              className="textarea"
            />

            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <div className="popup-actions">
              <button onClick={addTask} className="confirm-btn">Confirm</button>
              <button onClick={() => setShowPopup(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

