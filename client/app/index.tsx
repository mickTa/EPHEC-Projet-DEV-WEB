import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform, Image } from "react-native";
import CustomButton from "./components/CustomButton";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import Constants from "expo-constants";
import axios from "axios";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

export default function Index() {
  const router = useRouter();
  const[loading,setLoading]=useState(true);
  const[reload,setReload]=useState(<></>);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("jwtToken");
      if(token){
        try {
          const response = await axios.get(`${API_BASE_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          AsyncStorage.setItem("userData",JSON.stringify(response?.data))
          router.replace("/screens/HomeScreen")

        } catch (error) {
          console.error("Erreur récupération utilisateur:", error);
          if (Platform.OS === 'web') {
            window.alert(
              "Erreur, une erreur est survenue lors de la récupération de vos données."
            );
          } else {
            Alert.alert(
              "Erreur",
              "Une erreur est survenue lors de la récupération de vos données."
            );
          }
          if (
            axios.isAxiosError(error) &&
            error.response &&
            error.response.status === 401
          ) {
            // Token expiré ou invalide
            await AsyncStorage.removeItem("jwtToken");
            await AsyncStorage.removeItem("userData");
            Alert.alert("Session expirée", "Veuillez vous reconnecter.");
          }else{
            setReload(
              <TouchableOpacity style={styles.reloadButton} onPress={()=>{router.replace("/")}}>
                <Image
                  source={require("./img/reload.svg")}
                  style={styles.reloadButtonIcon}
                />
              </TouchableOpacity>
            );
          }
        }
      }
      setLoading(false);
    };
  checkLoginStatus();
  }, []);

  const goToLogin = () => {
    router.replace("/screens/LoginScreen");
  };

  const goToRegister = () => {
    router.replace("/screens/RegisterScreen");
  };

  return (loading?
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader}/>
    :
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenue sur l'application !</Text>
        <View style={styles.buttonContainer}>
          <CustomButton title="Se connecter" onPressEvent={goToLogin} />
          <CustomButton title="S'inscrire" onPressEvent={goToRegister} />
        </View>
        {reload}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "70%",
    marginTop: 5,
    justifyContent: "space-between",
    gap: 10,
  },
  loader:{
    flex:1
  },
  reloadButton:{
    width: 30,
    flexDirection: "column",
    alignItems: "center",
    
  },
  reloadButtonIcon:{
    width: 30,
    height: 30,

  }
});
