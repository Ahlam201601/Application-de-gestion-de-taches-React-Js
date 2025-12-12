import { useDrop } from 'react-dnd';
import { FaCircle } from 'react-icons/fa';
import TaskCard from '../TaskCard/TaskCard';
import './Review.css';

const Review = ({ tasks, onEdit, onDelete, onDrop, onMoveWithinColumn, isAuthenticated }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item) => {
      if (item.status !== 'review') {
        onDrop(item.id, 'review');
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const sortedTasks = [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div ref={drop} className={`review-column ${isOver ? 'drag-over' : ''}`}>
      <div className="column-header">
        <h2>Review</h2>
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
            status="review"
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

export default Review;
