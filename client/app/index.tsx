import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; // Utilisation d'expo-router pour la navigation

export default function Index() {
  const router = useRouter(); // Hook pour gérer la navigation

  // Fonction pour la navigation vers la page de connexion
  const goToLogin = () => {
    router.push("/screens/LoginScreen"); // Rediriger vers /login
  };

  // Fonction pour la navigation vers la page d'inscription
  const goToRegister = () => {
    router.push("/screens/RegisterScreen"); // Rediriger vers /register
  };

  // Fonction pour la navigation vers la page du profil
  const goToProfile = () => {
    router.push("/screens/profile"); // Rediriger vers /profile
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur l'application !</Text>
      <View style={styles.buttonContainer}>
        <Button title="Aller à la Connexion" onPress={goToLogin} />
        <Button title="S'inscrire" onPress={goToRegister} />
        <Button title="Voir mon Profil" onPress={goToProfile} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
});
