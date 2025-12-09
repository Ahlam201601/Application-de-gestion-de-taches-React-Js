import axios from 'axios';

const API_URL = 'http://localhost:3001';
// Récupérer toutes les tâches
export const getTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    return [];
  }
};

// Créer une nouvelle tâche
export const createTask = async (task) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, task);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    throw error;
  }
};