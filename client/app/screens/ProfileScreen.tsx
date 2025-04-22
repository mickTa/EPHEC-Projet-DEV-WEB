import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
} from "react-native";
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
          router.replace("/");
          return;
        }

        const response = await axios.get("http://localhost:3000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Erreur récupération utilisateur:", error);
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 401
        ) {
          // Token expiré ou invalide
          await AsyncStorage.removeItem("jwtToken");
          Alert.alert("Session expirée", "Veuillez vous reconnecter.");
          router.replace("/");
        } else {
          Alert.alert(
            "Erreur",
            "Une erreur est survenue lors de la récupération de vos données."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("jwtToken");
      router.replace("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  if (loading)
    return (
      <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />
    );
  if (!userData)
    return (
      <Text>Impossible de charger les informations de l'utilisateur.</Text>
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/screens/HomeScreen")}
        >
          <Image
            source={require("../img/arrow-left.png")}
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Profil</Text>
      </View>

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
            onPress={() => router.replace("./ModifyPasswordScreen")}
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
    marginLeft: 75,
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
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
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
});
