import React, {useState, useEffect} from 'react'
import { updateTask } from '../../../Api'
import toast from 'react-hot-toast'
import './Edit.css'

const Edit = ({task, isAuthenticated, onTaskUpdated, onClose, isOpen}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'moyenne',
    status: 'todo'
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    priority: '',
    status: ''
  });

  const validPriorities = ['basse', 'moyenne', 'urgente'];
  const validStatuses = ['todo', 'inprogress', 'done'];

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'moyenne',
        status: task.status || 'todo'
      });
      setErrors({
        title: '',
        description: '',
        priority: '',
        status: ''
      });
    }
  }, [task]);

  const validateField = (name, value) =>{
    let error = '';

    switch (name) {
      case 'title':
        if (!value || !value.trim()) {
          error = 'Le titre est requis';
        } else if (value.trim().length < 3) {
          error = 'Le titre doit contenir au moins 3 caractères';
        } else if (value.trim().length > 100) {
          error = 'Le titre ne peut pas dépasser 100 caractères';
        }
        break;

      case 'description':
        if (value && value.length > 500) {
          error = 'La description ne peut pas dépasser 500 caractères';
        }
        break;

      case 'priority':
        if (!validPriorities.includes(value)) {
          error = 'Priorité invalide';
        }
        break;

      case 'status':
        if (!validStatuses.includes(value)) {
          error = 'Statut invalide';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {
      title: validateField('title', formData.title),
      description: validateField('description', formData.description),
      priority: validateField('priority', formData.priority),
      status: validateField('status', formData.status)
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleChange = (e) =>{
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour modifier une tâche');
      return;
    }

    if (!validateForm()) {
    toast.error('Veuillez corriger les erreurs dans le formulaire');
    return;
  }

  try {
    await updateTask(task.id, {...task, ...formData});
    toast.success('Tâche modifiée avec succès !');
    onTaskUpdated();
    onClose();
  } catch (error) {
    toast.error('Erreur lors de la modification de la tâche');
  }
  };

  if(!isOpen || !task) return null;

  


 return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Edit Task</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="popup-form">
          <div className="form-group">
            <label>Task title...</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Task title..."
              className={errors.title ? 'input-error' : ''}
              maxLength={100}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
            <span className="char-count">{formData.title.length}/100</span>
          </div>

          <div className="form-group">
            <label>Task description...</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Task description..."
              rows="4"
              className={errors.description ? 'input-error' : ''}
              maxLength={500}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
            <span className="char-count">{formData.description.length}/500</span>
          </div>

          <div className="form-group">
            <label>Priorité</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={errors.priority ? 'input-error' : ''}
            >
              <option value="basse">Low</option>
              <option value="moyenne">Medium</option>
              <option value="urgente">High</option>
            </select>
            {errors.priority && <span className="error-message">{errors.priority}</span>}
          </div>

          <div className="form-group">
            <label>Statut</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={errors.status ? 'input-error' : ''}
            >
              <option value="todo">À faire</option>
              <option value="inprogress">En cours</option>
              <option value="done">Terminé</option>
            </select>
            {errors.status && <span className="error-message">{errors.status}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Edit