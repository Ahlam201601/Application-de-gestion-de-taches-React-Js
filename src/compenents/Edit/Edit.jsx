import React, {useState, useEffect} from 'react'
import { updateTask } from '../../../Api'
import toast from 'react-hot-toast'
import './Edit.css'

const Edit = (task) => {
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

  useEffect(()=> {
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



  return (
    <div>Edit</div>
  )
}

export default Edit