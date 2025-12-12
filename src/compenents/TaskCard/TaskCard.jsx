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
  return (
    <div>TaskCard</div>
  )
}

export default TaskCard