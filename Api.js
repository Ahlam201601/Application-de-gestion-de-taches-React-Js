import axios from "axios";

const API_URL = "http://localhost:3001";


export const getTrash = async () => {
  const res = await axios.get(`${API_URL}/trash`);
  return res.data;
};


//uupdate task
export const updateTask = async (id, task) =>{
    try {
        const response = await axios.put(`${API_URL}/tasks/${id}`, task);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la tâche:', error);
    }
};