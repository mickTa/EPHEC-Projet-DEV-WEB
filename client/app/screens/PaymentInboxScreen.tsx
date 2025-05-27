import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import useSocket from "../../hooks/useSocket"; // Assure-toi que ce chemin est correct

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

type PaymentRequest = {
  id: number;
  amount: number;
  description: string;
};

export default function PaymentInboxScreen() {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const token = await AsyncStorage.getItem("jwtToken");
    const res = await axios.get(`${API_BASE_URL}/payment-requests/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequests(res.data);
    setLoading(false);
  };

  const handleAction = async (id: number, action: "accept" | "reject") => {
    const token = await AsyncStorage.getItem("jwtToken");
    try {
      await axios.post(
        `${API_BASE_URL}/payment-requests/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert(
        "Succès",
        `Demande ${action === "accept" ? "acceptée" : "refusée"}.`
      );
      fetchRequests(); // refresh
    } catch (err) {
      Alert.alert("Erreur", `Impossible de ${action} la demande.`);
    }
  };

  useSocket((socket) => {
    socket.on("newPaymentRequest", (request) => {
      console.log("📨 Paiement reçu :", request);
      if (typeof request.id !== "number") {
        console.warn("❌ ID de requête invalide reçu :", request.id);
        return;
      }
      Alert.alert(
        "Nouvelle demande",
        `${request.description} - ${request.amount}€`,
        [
          {
            text: "Accepter",
            onPress: () => handleAction(request.id, "accept"),
          },
          {
            text: "Refuser",
            onPress: () => handleAction(request.id, "reject"),
            style: "cancel",
          },
        ]
      );
      fetchRequests(); // refresh la liste
    });
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Demandes de paiement</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : requests.length === 0 ? (
        <Text>Aucune demande en attente.</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>Montant : {item.amount} €</Text>
              <Text>Description : {item.description}</Text>
              <View style={styles.actions}>
                <Button
                  title="✅ Accepter"
                  onPress={() => handleAction(item.id, "accept")}
                />
                <Button
                  title="❌ Refuser"
                  onPress={() => handleAction(item.id, "reject")}
                />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});
