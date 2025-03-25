import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import EventContainer from './components/EventContainer';
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
    <>
      <View style={styles.container}>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Bienvenue sur l'application !</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Aller à la Connexion" onPress={goToLogin} />
          <Button title="S'inscrire" onPress={goToRegister} />
          <Button title="Voir mon Profil" onPress={goToProfile} />
        </View>

      </View>

      <View style={styles.tabsContainer}>
        <Text style={styles.tab}>Home</Text>
        <Text style={styles.tab}>Tab2</Text>
        <Text style={styles.tab}>Tab3</Text>
        <Text style={styles.tab} onPress={goToProfile}>Profile</Text>
      </View>

      <EventContainer title="Event1" text="Small description of the item" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "space-between",
    alignItems: "center",
    //padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    //marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxHeight: "10%",
  },
  buttonContainer: {
    maxHeight: "20%",
    width: "70%",
    marginTop: 20,
    flex: 1,
    justifyContent: "space-between",
  },
  tab: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tabsContainer: {
    width: "100%",
    backgroundColor: "lightgray",
    maxHeight: "7%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
