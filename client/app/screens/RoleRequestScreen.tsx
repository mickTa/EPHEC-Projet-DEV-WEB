import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import TopBar from "../components/TopBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import "react-datetime/css/react-datetime.css";
import { useEffect } from "react";
import ListItem from "../components/ListItem";

import Constants from "expo-constants";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

const handleError = (error: any) => {
  if (axios.isAxiosError(error) && error.response) {
    Alert.alert(
      "Erreur",
      `Erreur: ${error.response.data.message || "Un problème est survenu."}`
    );
  } else {
    Alert.alert("Erreur", "Problème avec la connexion au serveur.");
  }

  if (
    axios.isAxiosError(error) &&
    error.response &&
    error.response.status === 401
  ) {
    AsyncStorage.removeItem("jwtToken");
    Alert.alert("Session expirée", "Veuillez vous reconnecter.");
    router.replace("/");
  } else {
    Alert.alert(
      "Erreur",
      "Une erreur est survenue lors de la récupération de vos données."
    );
  }
};

const RoleRequestScreen = () => {

  const [requests, setRequests] = useState(null);

  const getRequests = async () => {

    const token = await AsyncStorage.getItem("jwtToken");

    try {
      const response = await fetch(`${API_BASE_URL}/roleRequests/getAll`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        }
      });
      const data = await response.json();
      console.log(data);
      setRequests(data);
    } catch (error) {
      console.error("Erreur de connexion", error);
      Alert.alert("Échec de la connexion", "Vérifiez vos identifiants.");
    }
  }

  const accept = async (requestId: number) => {
    const token = await AsyncStorage.getItem("jwtToken");

    try {
      const response = await fetch(`${API_BASE_URL}/roleRequests/acceptRequest`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          requestId
        }),
      });
      await getRequests();
    } catch (error) {
      console.error("Erreur de connexion", error);
      Alert.alert("Échec de la connexion", "Vérifiez vos identifiants.");
    }
  }

  const reject = async (requestId: number) => {
    const token = await AsyncStorage.getItem("jwtToken");

    try {
      const response = await fetch(`${API_BASE_URL}/roleRequests/rejectRequest`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          requestId
        }),
      });
      await getRequests();
    } catch (error) {
      console.error("Erreur de connexion", error);
      Alert.alert("Échec de la connexion", "Vérifiez vos identifiants.");
    }
  }

  useEffect(() => {
    getRequests();
  }, []);


  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title="Gestion des demandes" previous="HomeScreen" />
      <ScrollView>
        <br />
        <br />
        <br />
        <br />
        {requests && (
          <>
            <View style={styles.tab}>
              <ListItem
                texts={["User ID", "Statut", "Date de demande"]}
              />
            </View>
            {requests.map((req) => {
              return (
                <View style={styles.tab}>
                  <ListItem
                    texts={[req.userId, req.status, (new Date(parseInt(req.date, 10))).toLocaleDateString("fr-FR")]}
                  />

                  {req.status === "PENDING" && (
                    <View style={styles.buttonsTab}>
                      <Pressable style={styles.acceptButton} onPress={() => accept(req.id)}><Text style={styles.buttonsText}>Accept</Text></Pressable>
                      <Pressable style={styles.rejectButton} onPress={() => reject(req.id)}><Text style={styles.buttonsText}>Reject</Text></Pressable>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9"
  },
  tab: {
    flex: 1,
    marginVertical: 15,
    marginHorizontal: 10
  },
  buttonsTab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  acceptButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#218532",
    borderRadius: 6,
    alignItems: "center"
  },
  rejectButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#a10000",
    borderRadius: 6,
    alignItems: "center"
  },
  buttonsText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
})

export default RoleRequestScreen;

