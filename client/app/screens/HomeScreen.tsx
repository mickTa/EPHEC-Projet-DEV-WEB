import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import EventContainer from "../components/EventContainer";
import TabContainer from "../components/TabContainer";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import axios from "axios";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

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
        if (!token) {
          router.replace("/");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setEvents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements", error);

        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 401
        ) {
          await AsyncStorage.removeItem("jwtToken");
          alert("Session expirée. Veuillez vous reconnecter.");
          router.replace("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventPress = (eventId: number) => {
    router.push(`/screens/EventScreen?id=${eventId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Accueil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.events}>
          <Text style={styles.title}>Événements à la une</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            events.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => handleEventPress(event.id)}
              >
                <EventContainer title={event.name} text={event.description} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TabContainer />
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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 20,
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
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
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
