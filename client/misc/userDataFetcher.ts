import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import axios from "axios";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

export async function userDataFetcher(setUserData: any) {
  try {
    const token = await AsyncStorage.getItem("jwtToken");
    if (!token) {
      Alert.alert(
        "Erreur",
        "Vous devez être connecté pour accéder à cette page."
      );
      return;
    }

    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUserData ? setUserData(response.data) : null;
    return response.data;
  } catch (error) {
    console.error("Erreur récupération utilisateur:", error);
    Alert.alert(
      "Erreur",
      "Une erreur est survenue lors de la récupération de vos données."
    );
  }
}
