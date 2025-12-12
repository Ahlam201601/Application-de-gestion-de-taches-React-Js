import axios from "axios";

const API_URL = "http://localhost:3001";


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


export const getTrash = async () => {
  try {
    const res = await axios.get(`${API_URL}/trash`);
    return res.data;   
  } catch (error) {
    console.error("Erreur lors de la récupération de la corbeille :", error);   
  }
};




export const restoreTask = async (task) => {
  try{
    await axios.post(`${API_URL}/tasks`,task);
    await axios.delete(`${API_URL}/trash/${task.id}`);
  }catch(error){
    console.log("Erreur lors de la restauration :" , error);
  }
}


export const deleteTask = async (id) => {
  try {
    const task = await axios.get(`${API_URL}/tasks/${id}`);
    await axios.post(`${API_URL}/trash`, task.data);
    await axios.delete(`${API_URL}/tasks/${id}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    throw error;
  }
};

export const updateTask = async (id, task) =>{
    try {
        const response = await axios.put(`${API_URL}/tasks/${id}`, task);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la tâche:', error);
    }
};


// Supprimer définitivement une tâche
export const deletePermanently = async (id) => {
  try {
    await axios.delete(`${API_URL}/trash/${id}`);
    window.location.reload();
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression définitive:', error);
    throw error;
  }
};

