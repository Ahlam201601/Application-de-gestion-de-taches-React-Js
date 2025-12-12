import { useDrag, useDrop } from 'react-dnd';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './TaskCard.css';

import React from 'react'

const TaskCard = (task, index, isAuthenticated, status) => {

      const [{ isDragging }, drag] = useDrag({
    type: 'task', 
    item: { id: task.id, status: task.status, index }, 
    canDrag: () => isAuthenticated, 
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), 
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    canDrop: () => isAuthenticated,
    hover: (draggedItem) => {
      if (isAuthenticated && draggedItem.id !== task.id && draggedItem.status === status) {
        onMove(draggedItem.id, task.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(), 
    }),
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgente':
        return '#ff4757';
      case 'moyenne':
        return '#ffa502';
      case 'basse':
        return '#26de81';
      default:
        return '#747d8c';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'urgente':
        return 'High';
      case 'moyenne':
        return 'Medium';
      case 'basse':
        return 'Low';
      default:
        return priority;
    }
  };
  return (
    <div ref={drop}>
      <div
        ref={isAuthenticated ? drag : null} // Référence pour le drag (seulement si connecté)
        className={`task-card ${!isAuthenticated ? 'disabled' : ''} ${isDragging ? 'dragging' : ''} ${isOver ? 'drag-hover' : ''}`}
        style={{ opacity: isDragging ? 0.5 : 1, cursor: isAuthenticated ? 'move' : 'default' }}
      >
        <div className="task-header">
          <button className="icon-btn edit-btn" onClick={() => onEdit(task)} title="Modifier">
            <FaEdit />
          </button>
          <h3>{task.title}</h3>
          <button className="icon-btn delete-btn" onClick={() => onDelete(task.id)} title="Supprimer">
            <FaTrash />
          </button>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="priority-container">
          <span
            className="priority-badge"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {getPriorityLabel(task.priority)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
