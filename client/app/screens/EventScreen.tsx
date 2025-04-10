import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TabContainer from "../components/TabContainer";

export default function EventScreen() {
  const router = useRouter();
  const [event, setEvent] = useState<{ name: string; description: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const { eventId } = router.query;

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId) {
        try {
          const token = await AsyncStorage.getItem("jwtToken");
          const response = await fetch(`http://192.168.129.117:3000/events/${eventId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          setEvent(data);
        } catch (error) {
          console.error("Erreur lors de la récupération de l'événement", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvent();
  }, [eventId]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{event ? event.name : "Chargement..."}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.eventDetails}>
            <Text style={styles.eventDescription}>{event?.description}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TabContainer onPressEventTab1={() => router.push("/screens/WalletQRCodeScreen")} />
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
    textAlign: "center",
  },
  eventDetails: {
    padding: 20,
  },
  eventDescription: {
    fontSize: 18,
    marginTop: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
});
