import React, {useState, useEffect} from 'react'
import { updateTask } from '../../../Api'
import toast from 'react-hot-toast'
import './Edit.css'

const Edit = () => {
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
  return (
    <div>Edit</div>
  )
}

export default Edit