import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import EventContainer from "../components/EventContainer";
import TopBar from "../components/TopBar";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import axios from "axios";
import TabContainer from "../components/TabContainer";
import useSocket from "../../hooks/useSocket";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

type EventType = {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useSocket((socket) => {
    socket.on("pingTest", (msg) => {
      console.log("Ping reçu dans HomeScreen :", msg);
    });
  });

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
      <TopBar title="Accueil" previous="Home" />
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
                <EventContainer
                  title={event.name}
                  text={event.description}
                  image={event.imageUrl || undefined}
                />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      <TabContainer />
    </View>
  );
}

const styles = StyleSheet.create({
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
    paddingTop: 100,
  },
  container: {
    flex: 1,
  },
});
