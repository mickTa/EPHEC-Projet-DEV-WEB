import React from "react";
import { View, Button, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SendPaymentRequestScreen = () => {
  const handleSendRequest = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");

      const response = await axios.post(
        "http://localhost:3000/api/payment-request",
        {
          userId: 1, // l'utilisateur scanné
          organizerId: 3, // l'organisateur connecté
          eventId: 1, // facultatif pour maintenant
          amount: 50,
          description: "Achat de boisson",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Succès", "Demande de paiement envoyée !");
      console.log("Réponse :", response.data);
    } catch (error) {
      console.error("Erreur d'envoi :", error);
      Alert.alert("Erreur", "Impossible d’envoyer la demande.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title="Envoyer une demande de paiement"
        onPress={handleSendRequest}
      />
    </View>
  );
};

export default SendPaymentRequestScreen;
