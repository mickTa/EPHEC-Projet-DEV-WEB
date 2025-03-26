import React from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import EventContainer from './components/EventContainer';
import TabContainer from "./components/TabContainer";
import CustomButton from "./components/CustomButton";

import { useRouter } from "expo-router"; // Utilisation d'expo-router pour la navigation

export default function Index() {

  const router = useRouter(); // Hook pour gérer la navigation

  const goToLogin = () => {
    router.push("/screens/LoginScreen");
  };

  const goToRegister = () => {
    router.push("/screens/RegisterScreen");
  };

  const goToProfile = () => {
    router.push("/screens/profile");
  };
  
  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Bienvenue sur l'application !</Text>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton title="Se Connecter" onPressEvent={goToLogin} />
          <CustomButton title="S'inscrire" onPressEvent={goToRegister} />
        </View>

        <View style={styles.events}>
          <Text style={styles.title}>Événements à la une</Text>
          <EventContainer title="Event1" text="Insert small description of the event or even a corresponding image" />
          <EventContainer title="Event2" text="Insert small description of the event or even a corresponding image" />
          <EventContainer title="Event3" text="Insert small description of the event or even a corresponding image" />
        </View>

        

      </ScrollView>

      <TabContainer 
        onPressEventTab1={goToProfile}
        onPressEventTab2={goToRegister}
        onPressEventTab3={goToLogin}
      />


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
    maxHeight: 100,
    width: "70%",
    marginTop: 5,
    flex: 1,
    justifyContent: "space-between",
    gap: 10
  },
  events: {
    flex: 1,
    margin: 20,
    alignItems: "center",
    marginTop: 75,
    marginBottom: 200,
    gap: 30
  }
});
