import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button } from "react-native";
import { io } from "socket.io-client";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

type PaymentRequest = {
  id: string;
  amount: number;
  description: string;
};

const UserPaymentRequestsScreen = () => {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const connectSocket = async () => {
      const user = JSON.parse(
        (await AsyncStorage.getItem("userData")) ?? "null"
      );
      setUserId(user.id);
      const newSocket = io(API_BASE_URL);
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connecté au serveur Socket.IO");
        newSocket.emit("register", user.id);
      });

      newSocket.on("newPaymentRequest", (request: any) => {
        if (userId) {
          setPaymentRequests((prevRequests) => [...prevRequests, request]);
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    };
    connectSocket();
  }, [userId]);

  useEffect(() => {
    const fetchPaymentRequests = async () => {
      if (!userId) return;
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        const response = await axios.get(
          `${API_BASE_URL}/paymentRequests/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPaymentRequests(response.data);
      } catch (error) {
        console.error("Error fetching payment requests:", error);
      }
    };
    fetchPaymentRequests();
  }, [userId]);

  const handleApprove = async (requestId: string) => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      await axios.post(
        `${API_BASE_URL}/paymentRequests/${requestId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentRequests(paymentRequests.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      await axios.post(
        `${API_BASE_URL}/paymentRequests/${requestId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentRequests(paymentRequests.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Demandes de paiement
      </Text>
      {paymentRequests.length === 0 ? (
        <Text>Aucune demande de paiement en attente.</Text>
      ) : (
        <FlatList
          data={paymentRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}>
              <Text>Montant: {item.amount}</Text>
              <Text>Description: {item.description}</Text>
              <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
                <Button
                  title="Approuver"
                  onPress={() => handleApprove(item.id)}
                />
                <Button title="Rejeter" onPress={() => handleReject(item.id)} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default UserPaymentRequestsScreen;
