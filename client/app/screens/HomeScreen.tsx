import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import EventContainer from "../components/EventContainer";
import TabContainer from "../components/TabContainer";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Constants from "expo-constants";

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
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = response.data;
        setEvents(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const goToProfile = () => {
    router.replace("/screens/ProfileScreen");
  };

  const goToEvents = () => {
    router.replace("/screens/EventFormScreen");
  };

  const goToWalletQR = () => {
    router.replace("/screens/WalletQRCodeScreen");
  };

  const goToHome = () => {
    router.replace("/screens/HomeScreen");
  };
  const goToScanQrCode = () => {
    router.replace("/screens/SendPaymentRequestScreen");
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
              events.map((event, index) => (
                <EventContainer
                  key={index}
                  onPress={() => handleEventPress(event.id)}
                  title={event.name}
                  text={event.description}
                />
              ))
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TabContainer
            onPressEventTab1={goToHome}
            onPressEventTab2={goToEvents}
            onPressEventTab3={goToWalletQR}
            onPressEventTab4={goToScanQrCode}
            onPressEventTab5={goToProfile}
          />
        </View>
      </View>
    );
  };

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
}
