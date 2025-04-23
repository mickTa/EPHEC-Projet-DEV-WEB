import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EventScreen() {
  const { id } = useLocalSearchParams(); // récupère l'id passé dans l'URL
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        const response = await fetch(`http://localhost:3000/api/events/${id}`, {
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
    };

    fetchEvent();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 100 }} size="large" />;

  if (!event) return <Text style={styles.notFound}>Événement introuvable</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.text}>Description: {event.description}</Text>
      <Text style={styles.text}>Adresse: {event.address}</Text>
      <Text style={styles.text}>Début: {new Date(event.startDate).toLocaleString()}</Text>
      <Text style={styles.text}>Fin: {new Date(event.endDate).toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
  },
  notFound: {
    marginTop: 100,
    textAlign: "center",
    fontSize: 18,
  },
});
