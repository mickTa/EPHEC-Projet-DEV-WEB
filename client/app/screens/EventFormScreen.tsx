import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function CreateEventScreen() {
  const [name, setName] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateEvent = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("jwtToken");

      if (!token) {
        Alert.alert("Erreur", "Veuillez vous connecter d'abord.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/events",
        {
          name,
          organizer,
          startDate,
          endDate,
          address,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Événement créé avec succès !");
      router.replace("/screens/HomeScreen");
    } catch (error) {
      console.error("Erreur lors de la création de l'événement", error);
      Alert.alert(
        "Échec de la création",
        "Il y a eu un problème avec la création de l'événement."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un événement</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom de l'événement"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Organisateur"
        value={organizer}
        onChangeText={setOrganizer}
      />

      {/* Champ de saisie pour la date et l'heure de début */}
      <input
        type="datetime-local"
        name="startDate"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      {/* Champ de saisie pour la date et l'heure de fin */}
      <input
        type="datetime-local"
        name="endDate"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <TextInput
        style={styles.input}
        placeholder="Adresse"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <Button
        title={loading ? "Création..." : "Créer l'événement"}
        onPress={handleCreateEvent}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
