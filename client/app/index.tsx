import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import CustomButton from "./components/CustomButton";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("jwtToken");
      if (token) {
        setIsLoggedIn(true);
      }
    };
    checkLoginStatus();
  }, []);

  const goToLogin = () => {
    router.push("/screens/LoginScreen");
  };

  const goToRegister = () => {
    router.push("/screens/RegisterScreen");
  };

  if (isLoggedIn) {
    // Rediriger vers la page d'accueil si l'utilisateur est connecté
    router.push("/screens/HomeScreen");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur l'application !</Text>
      <View style={styles.buttonContainer}>
        <CustomButton title="Se connecter" onPressEvent={goToLogin} />
        <CustomButton title="S'inscrire" onPressEvent={goToRegister} />
      </View>
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
});
