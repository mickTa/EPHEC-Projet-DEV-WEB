import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import TopBar from "../components/TopBar";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

import DateTimePickerWeb from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { useEffect } from "react";

import Constants from "expo-constants";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

const DatePickerComponent = ({ value, onChange, label }: any) => {
  const showPicker = () => {
    DateTimePickerAndroid.open({
      value: value || new Date(),
      mode: "date",
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          onChange(selectedDate);
        }
      },
    });
  };

  return (
    <>
      <Text style={{ marginBottom: 8 }}>{label}</Text>
      {Platform.OS === "web" ? (
        <DateTimePickerWeb
          value={value || new Date()}
          onChange={(date: any) =>
            onChange(
              date && typeof date !== "string" ? date.toDate() : new Date(date)
            )
          }
          inputProps={{ placeholder: "Choisir une date" }}
        />
      ) : (
        <Button
          title={value ? value.toLocaleString() : "Choisir une date"}
          onPress={showPicker}
        />
      )}
    </>
  );
};

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

export default function EventFormScreen() {
  const [name, setName] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        if (!token) {
          router.replace("/");
          return;
        }

        const userData = await JSON.parse(await AsyncStorage.getItem("userData")??"null");
        if (userData?.role !== "ORGANIZER") {
          Alert.alert("Accès interdit", "Vous n'avez pas accès à cette page.");
          router.replace("/screens/HomeScreen");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        Alert.alert(
          "Erreur",
          "Problème lors de la vérification de votre rôle."
        );
        router.replace("/");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthorization();
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleString();
  };

  const handleCreateEvent = async () => {
    if (!name || !organizer || !address || !startDate || !endDate) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    if (startDate && endDate && endDate < startDate) {
      Alert.alert("Erreur", "La date de fin doit être après la date de début.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) {
        router.replace("/");
        return;
      }

      const formattedStartDate = startDate
        ?.toISOString()
        .split("T")
        .join(" ")
        .split("Z")[0];
      const formattedEndDate = endDate
        ?.toISOString()
        .split("T")
        .join(" ")
        .split("Z")[0];

      const response = await axios.post(
        `${API_BASE_URL}/events`,
        {
          name,
          organizer,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          address,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Événement créé avec succès !");
        router.replace("/screens/HomeScreen");
      } else {
        Alert.alert(
          "Échec de la création",
          "L'événement n'a pas pu être créé."
        );
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!isAuthorized) return null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopBar title="Créer un évenement" previous="HomeScreen" />
      <ScrollView contentContainerStyle={{ padding: 20, marginTop: 80 }}>
        <Text style={{ marginBottom: 8 }}>Nom de l'événement *</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nom"
          style={styles.input}
        />

        <Text style={{ marginBottom: 8 }}>Organisateur *</Text>
        <TextInput
          value={organizer}
          onChangeText={setOrganizer}
          placeholder="Organisateur"
          style={styles.input}
        />

        <Text style={{ marginBottom: 8 }}>Adresse *</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Adresse"
          style={styles.input}
        />

        <Text style={{ marginBottom: 8 }}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          multiline
          style={[styles.input, { height: 100 }]}
        />

        <DatePickerComponent
          label="Date de début *"
          value={startDate}
          onChange={setStartDate}
        />
        <DatePickerComponent
          label="Date de fin *"
          value={endDate}
          onChange={setEndDate}
        />

        <View style={{ marginTop: 30 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <Button title="Créer l'événement" onPress={handleCreateEvent} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
});
