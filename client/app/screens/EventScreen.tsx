import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  Linking,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Constants from "expo-constants";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

export default function EventScreen() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        const response = await fetch(`${API_BASE_URL}/events/${id}`, {
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

  const handleRegister = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");

      const response = await fetch(
        `http://localhost:3000/api/events/${id}/register`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          "Inscription réussie",
          "Tu es bien inscrit à l'événement !"
        );
      } else {
        Alert.alert("Erreur", result.message || "Impossible de s'inscrire.");
      }
    } catch (error) {
      console.error("Erreur pendant l'inscription :", error);
      Alert.alert("Erreur", "Une erreur s’est produite lors de l’inscription.");
    }
  };

  if (loading)
    return <ActivityIndicator style={{ marginTop: 100 }} size="large" />;

  if (!event) return <Text style={styles.notFound}>Événement introuvable</Text>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/screens/HomeScreen")}
          style={styles.backButton}
        >
          <Image
            source={require("../img/arrow-left.png")}
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de l'événement</Text>
      </View>

      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=1500&q=80",
        }}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>{event.name}</Text>
          <Text style={styles.text}>📍 Adresse : {event.address}</Text>
          <Text style={styles.text}>
            🗓️ Début : {new Date(event.startDate).toLocaleString()}
          </Text>
          <Text style={styles.text}>
            🛑 Fin : {new Date(event.endDate).toLocaleString()}
          </Text>
          <Text style={styles.text}>📝 Description :</Text>
          <Text style={styles.description}>{event.description}</Text>

          {event.videoUrl && (
            <TouchableOpacity
              style={styles.videoLink}
              onPress={() => Linking.openURL(event.videoUrl)}
            >
              <Text style={styles.videoText}>▶️ Voir la vidéo sur YouTube</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerText}>✅ S'inscrire à l'événement</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingTop: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: "#eee",
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: "#ddd",
    marginBottom: 20,
    fontStyle: "italic",
  },
  notFound: {
    marginTop: 100,
    textAlign: "center",
    fontSize: 18,
  },
  videoLink: {
    marginTop: 20,
    backgroundColor: "#ff4444",
    padding: 12,
    borderRadius: 8,
  },
  videoText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  registerButton: {
    marginTop: 30,
    backgroundColor: "#b8f2c9",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  registerText: {
    color: "#1b5e20",
    fontWeight: "bold",
    fontSize: 16,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
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
  backButton: {
    margin: 0,
  },
  backButtonIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
});
