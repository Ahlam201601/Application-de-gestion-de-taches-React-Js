import React from 'react';
import { useDrop } from 'react-dnd';
import { FaCircle } from 'react-icons/fa';
import TaskCard from '../TaskCard/TaskCard';
import './Doing.css';

const Doing = ({ tasks, onEdit, onDelete, onDrop, onMoveWithinColumn, isAuthenticated }) => {
  // useDrop permet de recevoir les tâches déplacées dans cette colonne
  const [{ isOver }, drop] = useDrop({
    accept: 'task', // Type d'élément accepté
    drop: (item) => {
      // Si la tâche n'est pas déjà dans cette colonne, on la déplace
      if (item.status !== 'inprogress') {
        onDrop(item.id, 'inprogress');
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(), // Indique si on survole la colonne
    }),
  });

  // Trier les tâches par ordre
  const sortedTasks = [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div
      ref={drop} // Référence pour le drop
      className={`doing-column ${isOver ? 'drag-over' : ''}`} // Style quand on survole
    >
      <div className="column-header">
        <h2>In Progress</h2>
        <div className="task-count-badge">
          <FaCircle className="count-icon" />
          <span>{tasks.length}</span>
        </div>
      </div>
      <div className="tasks-list">
        {sortedTasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            status="inprogress"
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMoveWithinColumn}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    </div>
  );
};

export default Doing;
