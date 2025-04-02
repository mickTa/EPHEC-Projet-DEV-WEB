import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import EventContainer from "../components/EventContainer";
import TabContainer from "../components/TabContainer";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        const response = await fetch("http://localhost:3000/events", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("jwtToken");
      router.push("/");
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenue à la page d'accueil</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.events}>
          <Text style={styles.title}>Événements à la une</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            events.map((event, index) => (
              <EventContainer key={index} title={event.name} text={event.description} />
            ))
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TabContainer
          onPressEventTab1={goToWalletQR}
          onPressEventTab2={goToProfile}
          onPressEventTab3={goToProfile}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
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
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
});
