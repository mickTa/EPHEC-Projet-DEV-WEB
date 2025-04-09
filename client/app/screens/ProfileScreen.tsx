import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import EventContainer from "../components/EventContainer";
import TabContainer from "../components/TabContainer";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface UserData {
  fullName: string;
  email: string;
  role: string;
}

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");

        if (!token) {
          console.log("Pas de token trouvé");
          Alert.alert(
            "Erreur",
            "Vous devez être connecté pour accéder à cette page."
          );
          return;
        }

        const response = await axios.get("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Erreur récupération utilisateur:", error);
        Alert.alert(
          "Erreur",
          "Une erreur est survenue lors de la récupération de vos données."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!userData) {
    return (
      <Text>Impossible de charger les informations de l'utilisateur.</Text>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.profilePic} />
        <Text style={styles.title}>Bienvenue, {userData.fullName}!</Text>
        <Text style={styles.info}>Email : {userData.email}</Text>
        <Text style={styles.info}>Rôle : {userData.role}</Text>

        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={() => router.push("./ModifyPasswordScreen")}
        >
          <Text style={styles.changePasswordText}>
            Modifier le mot de passe
          </Text>
        </TouchableOpacity>

        <View style={styles.events}>
          <Text style={styles.title}>Vos derniers achats :</Text>
          <View style={styles.inlineEvents}>
            <View style={styles.inlineEvent}>
              <Text>Event #1 : Event name</Text>
              <Text>0,00€</Text>
            </View>
            <View style={styles.inlineEvent}>
              <Text>Event #2 : Event name</Text>
              <Text>10,00€</Text>
            </View>
            <View style={styles.inlineEvent}>
              <Text>Event #3 : Event name</Text>
              <Text>50,00€</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  profilePic: {
    height: 140,
    width: 140,
    borderRadius: 70,
    backgroundColor: "lightgray",
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  changePasswordButton: {
    marginTop: 20,
    backgroundColor: "#4682B4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  changePasswordText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  events: {
    marginTop: 40,
    width: "100%",
    alignItems: "center",
  },
  inlineEvents: {
    marginTop: 20,
    width: "100%",
  },
  inlineEvent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
