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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // Pour mobile
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

// Importation du DateTimePicker pour le web
import DateTimePickerWeb from "react-datetime"; // Pour le web
import "react-datetime/css/react-datetime.css"; // Pour le CSS du calendrier web

const EventFormScreen = () => {
  const [name, setName] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);

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
        Alert.alert("Erreur", "Veuillez vous connecter d'abord.");
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
        "http://localhost:3000/api/events",
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
        // Par exemple, on vérifie si l'événement a bien été créé
        Alert.alert("Événement créé avec succès !");
        router.replace("/screens/HomeScreen");
      } else {
        // Si le statut n'est pas 201, on gère l'erreur
        Alert.alert(
          "Échec de la création",
          "L'événement n'a pas pu être créé."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la création de l’événement", error);
      if (axios.isAxiosError(error) && error.response) {
        // Le serveur a renvoyé une réponse d'erreur
        console.log("Détails de l'erreur:", error.response.data);
        Alert.alert(
          "Erreur",
          `Erreur: ${error.response.data.message || "Un problème est survenu."}`
        );
      } else {
        // Erreur côté client (réseau, etc.)
        Alert.alert("Erreur", "Problème avec la connexion au serveur.");
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
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

      {/* Date de début */}
      <Text style={{ marginBottom: 8 }}>Date de début *</Text>
      {Platform.OS === "web" ? (
        <DateTimePickerWeb
          value={startDate || new Date()}
          onChange={(date) =>
            setStartDate(
              date && typeof date !== "string" && "toDate" in date
                ? date.toDate()
                : new Date(date)
            )
          }
          inputProps={{ placeholder: "Choisir une date" }}
        />
      ) : (
        <View>
          <Button
            title={formatDate(startDate) || "Choisir une date"}
            onPress={() => setShowStartPicker(true)}
          />
          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="datetime"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartPicker(Platform.OS === "ios");
                if (event.type === "set" && selectedDate) {
                  setStartDate(selectedDate);
                }
              }}
            />
          )}
        </View>
      )}

      {/* Date de fin */}
      <Text style={{ marginTop: 20, marginBottom: 8 }}>Date de fin *</Text>
      {Platform.OS === "web" ? (
        <DateTimePickerWeb
          value={endDate || new Date()}
          onChange={(date) =>
            setEndDate(
              date && typeof date !== "string" && "toDate" in date
                ? date.toDate()
                : new Date(date)
            )
          }
          inputProps={{ placeholder: "Choisir une date" }}
        />
      ) : (
        <View>
          <Button
            title={formatDate(endDate) || "Choisir une date"}
            onPress={() => setShowEndPicker(true)}
          />
          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="datetime"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndPicker(Platform.OS === "ios");
                if (event.type === "set" && selectedDate) {
                  setEndDate(selectedDate);
                }
              }}
            />
          )}
        </View>
      )}

      <View style={{ marginTop: 30 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <Button title="Créer l'événement" onPress={handleCreateEvent} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
};

export default EventFormScreen;
