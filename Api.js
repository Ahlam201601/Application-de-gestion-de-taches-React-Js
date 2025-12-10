import axios from "axios";

const API_URL = "http://localhost:3001";


export const getTrash = async () => {
  const res = await axios.get(`${API_URL}/trash`);
  return res.data;
};

