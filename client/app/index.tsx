import React from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Bienvenue sur l'application !</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Se Connecter" onPress={goToLogin} />
          <Button title="S'inscrire" onPress={goToRegister} />
        </View>

        <View style={styles.events}>
          <Text style={styles.title}>Événements à la une</Text>
          <EventContainer title="Event1" text="Insert small description of the event or even a corresponding image" />
          <EventContainer title="Event2" text="Insert small description of the event or even a corresponding image" />
          <EventContainer title="Event3" text="Insert small description of the event or even a corresponding image" />
        </View>

      </ScrollView>

      {/*<View style={styles.tabsContainer}>
        <Text style={styles.tab}>Home</Text>
        <Text style={styles.tab}>Tab2</Text>
        <Text style={styles.tab}>Tab3</Text>
        <Text style={styles.tab} onPress={goToProfile}>Profile</Text>
      </View>*/}

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxHeight: 150
  },
  buttonContainer: {
    maxHeight: 85,
    width: "70%",
    marginTop: 20,
    flex: 1,
    justifyContent: "space-between"
  },
  //todo: create and implement component
  //------------------------------------
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
  //------------------------------------
  events: {
    flex: 1,
    margin: 20,
    alignItems: "center",
    marginTop: 75,
    marginBottom: 200,
    gap: 30
  }
});
