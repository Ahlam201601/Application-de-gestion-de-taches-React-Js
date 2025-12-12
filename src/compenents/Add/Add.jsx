import React, { useState } from 'react';
import { createTask } from '../../../Api';
import toast from 'react-hot-toast';
import './Add.css';

// Formulaire d'ajout sans contexte : on reçoit juste isAuthenticated en prop
const Add = ({ isOpen, onClose, onTaskAdded, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'moyenne',
    status: 'todo',
    order: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour créer une tâche');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Le titre est requis !');
      return;
    }

    try {
      // L'ordre sera géré par le backend ou calculé côté client
      await createTask({
        ...formData,
        order: 0 // Sera mis à jour automatiquement
      });
      toast.success('Tâche créée avec succès !');
      setFormData({
        title: '',
        description: '',
        priority: 'moyenne',
        status: 'todo',
        order: 0
      });
      onTaskAdded();
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la création de la tâche');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Add New Task</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="popup-form">
          <div className="form-group">
            <label>Task title...</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Task title..."
              required
            />
          </div>

          <div className="form-group">
            <label>Task description...</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Task description..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Priorité</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="basse">Low</option>
              <option value="moyenne">Medium</option>
              <option value="urgente">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="todo">À faire</option>
              <option value="inprogress">En cours</option>
              <option value="done">Terminé</option>
              <option value="review">Review</option>
            </select>
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
};
export default Add;
