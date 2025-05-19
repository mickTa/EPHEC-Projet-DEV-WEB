import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Linking,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import TopBar from "../components/TopBar";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

export default function EventScreen() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<any>(null);
  const [registration, setRegistration] = useState<any>(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [registrationLoading, setRegistrationLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("jwtToken");

      try {
        const response = await fetch(`${API_BASE_URL}/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setEvent(await response.json());
      } catch (error) {
        console.error("Erreur lors de la récupération de l'événement", error);
      } finally {
        setEventLoading(false);
      }

      try {
        const response = await fetch(`${API_BASE_URL}/registration/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result=await response.json()
        setRegistration(result);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'inscription", error);
      } finally {
        setRegistrationLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRegister = async () => {
    setRegistrationLoading(true);
    try {
      const token = await AsyncStorage.getItem("jwtToken");

      const response = await fetch(`${API_BASE_URL}/registration`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
          id,
          organizerId:event.organizerId
        })
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          "Inscription réussie",
          "Tu es bien inscrit à l'événement !"
        );
        setRegistration({registered:true,wallet:result.wallet.id})
      } else {
        Alert.alert("Erreur", result.message || "Impossible de s'inscrire.");
      }
    } catch (error) {
      console.error("Erreur pendant l'inscription :", error);
      Alert.alert("Erreur", "Une erreur s’est produite lors de l’inscription.");
    }
    setRegistrationLoading(false);
  };

  const handleUnregister = async () => {
    setRegistrationLoading(true);
    try {
      const token = await AsyncStorage.getItem("jwtToken");

      const response = await fetch(`${API_BASE_URL}/registration/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          "Désinscription réussie",
          "Tu es bien désinscrit de l'événement !"
        );
        setRegistration({registered:false})
      } else {
        Alert.alert("Erreur", result.message || "Impossible de se désinscrire.");
      }
    } catch (error) {
      console.error("Erreur pendant la désinscription :", error);
      Alert.alert("Erreur", "Une erreur s’est produite lors de la désinscription.");
    }
    setRegistrationLoading(false);
  };

  if (eventLoading)
    return <ActivityIndicator style={{ marginTop: 100 }} size="large" />;
  if (!event) return <Text style={styles.notFound}>Événement introuvable</Text>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopBar title="Détails de l'événement" previous="HomeScreen" />
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
              style={[styles.button,{backgroundColor:"#c90028"}]}
              onPress={() => Linking.openURL(event.videoUrl)}
            >
              <Text style={styles.buttonText}>▶️ Voir la vidéo sur YouTube</Text>
            </TouchableOpacity>
          )}

          <View>
            {registrationLoading?
              <ActivityIndicator style={[styles.button,{backgroundColor:"#888888"}]}/>
            :
              registration?
                <TouchableOpacity
                  style={[styles.button,{backgroundColor:registration.registered?"#ff4444":"#b8f2c9"}]}
                  onPress={registration.registered?handleUnregister:handleRegister}
                >
                  <Text style={styles.buttonText}>{registration.registered?"Se désinscrire":"S'inscrire"}</Text>
                </TouchableOpacity>
              :
                <Text style={styles.buttonText}>Erreur de récupération des données d'inscription.</Text>
            }
          </View>
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
  button: {
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#1b5e20",
    fontWeight: "bold",
    fontSize: 16,
  },
});
