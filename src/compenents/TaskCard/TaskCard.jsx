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
    <div>TaskCard</div>
  )
}

export default TaskCard