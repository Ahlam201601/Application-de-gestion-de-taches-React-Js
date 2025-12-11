import { useDrop } from 'react-dnd';
import { FaCircle } from 'react-icons/fa';
import TaskCard from '../TaskCard/TaskCard';
import './Done.css';
const Done = (onDrop, tasks) => {
  const [{isOver}, drop] = useDrop({
    accept: 'task',
    drop: (item) =>{
      if (item.status !== 'done') {
        onDrop(item.id, 'done');
      }
    },
    collect: (monitor) =>({
      isOver: monitor.isOver(),
    }),
  });

  const sortedTasks = [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));
  return (
    <div 
      ref={drop}
      className={`done-column ${isOver ? 'drag-over' : ''}`}
    >
      <div className="column-header">
        <h2>Done</h2>
        <div className="task-count-badge">
          <FaCircle className="count-icon" />
          <span>{tasks.length}</span>
        </div>
      </div>
    </div>
  )
}

export default Done