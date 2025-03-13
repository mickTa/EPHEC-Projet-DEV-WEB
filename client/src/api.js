import axios from "axios";

const API_URL = "http://localhost:3000"; // Remplace par l'IP locale de ton serveur

export const getData = async () => {
  try {
    const response = await axios.get(`${API_URL}/route-de-ton-api`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données", error);
    return null;
  }
};
