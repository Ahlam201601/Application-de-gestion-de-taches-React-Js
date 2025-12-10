import axios from "axios";

const API_URL = "http://localhost:3001";


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


export const deleteTaskForever = async (id) => {
  try {
    await axios.delete(`${API_URL}/trash/${id}`);
    
  } catch (error) {
    console.error("Erreur lors de la suppression définitive :", error);
  }
};
