import {Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


export async function userDataFetcher(setUserData:any){
    try{
        const token = await AsyncStorage.getItem("jwtToken");
        if (!token){
            Alert.alert(
                "Erreur",
                "Vous devez être connecté pour accéder à cette page."
            );
            return;
        }


        const response = await axios.get("http://localhost:3000/api/users/me",{
            headers: { Authorization: `Bearer ${token}` },
        });
        setUserData?setUserData(response.data):null;
        return response.data;
    }catch(error){
        console.error("Erreur récupération utilisateur:", error);
        Alert.alert(
            "Erreur",
            "Une erreur est survenue lors de la récupération de vos données."
        );
    }
}