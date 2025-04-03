import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import EventContainer from "../components/EventContainer";
import TabContainer from "../components/TabContainer";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Définir un type pour les données utilisateur
interface UserData {
  fullName: string;
  email: string;
  role: string;
}

export default function ProfileScreen() {
  // Typage explicite de `userData` avec `UserData | null`
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

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

        const response = await axios.get(
          "http://localhost:3000/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
        <View style={styles.profilePic}></View>
        <Text style={styles.title}>Bienvenue, {userData.fullName}!</Text>
        <Text>Email: {userData.email}</Text>
        <Text>Rôle: {userData.role}</Text>
        <View style={styles.events}>
          <Text style={styles.title}>Vos derniers achats :</Text>
          {/* insert for loop */}
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
      {/*
      <TabContainer
          onPressEventTab1={goToWalletQR}
          onPressEventTab2={goToProfile}
          onPressEventTab3={goToProfile}
      />
      */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },
  profilePic: {
    height: 140,
    width: 140,
    borderRadius: "100%",
    backgroundColor: "lightgray",
    marginBottom: 40
  },
  events: {
    marginTop: 40,
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  inlineEvents: {
    marginTop: 40,
    flex: 1,
    width: "100%",
    flexDirection: "column",
    //justifyContent: "space-between"
  },
  inlineEvent: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
