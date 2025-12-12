import React from 'react';
import { useDrop } from 'react-dnd';
import { FaCircle } from 'react-icons/fa';
import './ToDo.css';

const ToDo = ({ tasks, onDrop}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item) => {
      if (item.status !== 'todo') {
        onDrop(item.id, 'todo');
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });



  return (
    <div ref={drop} className={`todo-column ${isOver ? 'drag-over' : ''}`}>
      <div className="column-header">
        <h2>To Do</h2>
        <div className="task-count-badge">
          <FaCircle className="count-icon" />
          <span>{tasks.length}</span>
        </div>
      </div>
      
    </div>
  );
};

export default ToDo;
