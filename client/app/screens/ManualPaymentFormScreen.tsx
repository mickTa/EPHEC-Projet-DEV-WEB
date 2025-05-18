import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

export default function ManualPaymentFormScreen() {
  const { userId, organizerId, walletId, eventId } = useLocalSearchParams();
  const parsedWalletId = Number(walletId);
  // console.log("🧾 Params:", {
  //   userId,
  //   organizerId,
  //   walletId,
  //   parsedWalletId,
  //   eventId,
  // });
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    console.log("handleSubmit triggered");
    if (!amount || isNaN(+amount)) {
      Alert.alert("Erreur", "Veuillez entrer un montant valide.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("jwtToken");
      console.log("✅ Token récupéré :", token);

      const payload = {
        walletId: Number(walletId),
        userId,
        organizerId,
        eventId,
        amount: parseFloat(amount),
        description: description || "Achat produit",
      };

      console.log("📦 Payload envoyé :", payload);
      console.log("🌍 URL API :", `${API_BASE_URL}/payment-requests`);

      const response = await axios.post(
        `${API_BASE_URL}/payment-requests`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 5000, // Ajoute un timeout pour forcer une erreur si bloqué
        }
      );

      console.log("✅ Réponse reçue :", response.data);

      Alert.alert("Succès", "Demande de paiement envoyée !");
      router.replace("/screens/HomeScreen");
    } catch (error) {
      console.log("❌ Erreur Axios détectée");
      if (axios.isAxiosError(error)) {
        console.error("📛 Axios Error message:", error.message);
        console.error("📛 Axios Response data:", error.response?.data);
        console.error("📛 Axios Response status:", error.response?.status);
      } else {
        console.error("⚠️ Erreur inconnue:", error);
      }
      Alert.alert("Erreur", "Échec de la création de la demande.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer une demande de paiement</Text>

      <TextInput
        style={styles.input}
        placeholder="Montant (€)"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="Description (ex: 2 bières)"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Valider la demande</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
