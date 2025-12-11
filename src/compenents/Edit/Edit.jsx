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

  return (
    <div>Edit</div>
  )
}

export default Edit