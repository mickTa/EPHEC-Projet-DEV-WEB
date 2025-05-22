import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Platform,
  ScrollView,
  Alert,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import TopBar from "../components/TopBar";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router,useLocalSearchParams } from "expo-router";
import DateTimePickerWeb from "react-datetime";
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
    } catch (error) {
      console.error("Erreur de connexion", error);
      Alert.alert("Échec de la connexion", "Vérifiez vos identifiants.");
    }
  }

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <View>
      {requests && (
        <>
          {requests.map((req) => {
            return (
              <>
                <ListItem
                  texts={[req.userId, req.status, req.date]}
                />
                <Pressable onPress={() => accept(req.id)}>ACCEPT</Pressable>
                <Pressable onPress={() => reject(req.id)}>REJECT</Pressable>
              </>
            );
          })}
        </>
      )}
    </View>
  );
};

export default RoleRequestScreen;

