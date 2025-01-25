import axios from "axios";

const API_URL = 'localhost:3001/music'; 

export const getMusicas = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; 
  } catch (error) {
    console.error('Error al obtener las músicas', error);
    return [];
  }
};