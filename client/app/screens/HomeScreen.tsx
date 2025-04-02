// HomeScreen.tsx (avec bouton de déconnexion)
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import EventContainer from "../components/EventContainer";
import TabContainer from "../components/TabContainer";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const router = useRouter();

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      // Suppression du token JWT
      await AsyncStorage.removeItem("jwtToken");

      // Redirection vers la page d'index
      router.push("/"); // Utilise la route "/"
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  const goToProfile = () => {
    router.push("/screens/profile");
  };

  const goToWalletQR = () => {
    router.push("/screens/WalletQRCodeScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenue à la page d'accueil</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.events}>
        <Text style={styles.title}>Événements à la une</Text>
        <EventContainer title="Event1" text="Insert small description of the event or even a corresponding image" />
        <EventContainer title="Event2" text="Insert small description of the event or even a corresponding image" />
        <EventContainer title="Event3" text="Insert small description of the event or even a corresponding image" />
      </View>

      <TabContainer
        onPressEventTab1={goToProfile}
        onPressEventTab2={goToProfile}
        onPressEventTab3={goToWalletQR}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  events: {
    flex: 1,
    margin: 20,
    alignItems: "center",
    marginTop: 75,
    marginBottom: 200,
    gap: 30,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});
