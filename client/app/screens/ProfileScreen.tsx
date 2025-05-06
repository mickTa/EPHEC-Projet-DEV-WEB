import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import TopBar from "../components/TopBar";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import Constants from "expo-constants";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

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
      setUserData(JSON.parse(await AsyncStorage.getItem("userData")??"null"));
      setLoading(false);
    };
    
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("jwtToken");
      await AsyncStorage.removeItem("userData");
      router.replace("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  if (loading)
    return (
      <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title="Mon profil" previous="HomeScreen" />
      {userData?
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.profilePic} />
            <Text style={styles.title}>Bienvenue, {userData.fullName}!</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.info}>Email : {userData.email}</Text>
            <Text style={styles.info}>Rôle : {userData.role}</Text>
            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={() => router.replace("/screens/ModifyPasswordScreen")}
            >
              <Text style={styles.changePasswordText}>
                Modifier le mot de passe
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.subtitle}>Vos derniers achats :</Text>
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
        </ScrollView>
      :
        <Text style={styles.noData}>Impossible de charger les informations de l'utilisateur</Text>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContent: {
    padding: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  logoutButton: {
    marginTop: 60,
    backgroundColor: "#ff4d4d",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
  profileInfo: {
    alignItems: "center",
    marginVertical: 20,
  },
  profilePic: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: "#ccc",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    elevation: 3,
    marginVertical: 12,
  },
  changePasswordButton: {
    marginTop: 15,
    backgroundColor: "#4682B4",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  changePasswordText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  inlineEvent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  noData:{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    fontSize: 20,
    fontWeight: "bold",
  }
});
