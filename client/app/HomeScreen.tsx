import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import TopBar from"./components/TopBar";
import EventContainer from "./components/EventContainer";
import TabContainer from "./components/TabContainer";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<
    { id: number; name: string; description: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        const response = await fetch("http://localhost:3000/api/events", {
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

  const handleEventPress = (eventId: number) => {
    router.push(`/EventScreen?id=${eventId}`);
  };

  return (
    <View style={styles.container}>
      <TopBar title={"Accueil"}/>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.events}>
          <Text style={styles.title}>Événements à la une</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            events.map((event, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleEventPress(event.id)}
              >
                <EventContainer
                  title={event.name}
                  text={event.description}
                />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TabContainer/>
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
    paddingTop: 100,
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
    gap: 30,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
