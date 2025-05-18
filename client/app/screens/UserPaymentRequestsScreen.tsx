import React, { useEffect, useState } from "react";
import { View, Text, Button, Modal } from "react-native";
import axios from "axios";

interface PendingRequestsProps {
  token: string;
}

interface PaymentRequest {
  id: string;
  description: string;
  amount: number;
  // add other fields if needed
}

export default function PendingRequests({ token }: PendingRequestsProps) {
  const [pendingRequests, setPendingRequests] = useState<PaymentRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(
    null
  );

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("http://192.168.0.247:3000/api/payment-requests/pending", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setPendingRequests(res.data);
          if (res.data.length > 0) setSelectedRequest(res.data[0]);
        })
        .catch(console.error);
    }, 5000); // toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  const handleAccept = () => {
    if (!selectedRequest) return;
    axios
      .post(
        `http://192.168.0.247:3000/api/payment-requests/${selectedRequest.id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Demande acceptée");
        setSelectedRequest(null);
      })
      .catch(console.error);
  };

  const handleReject = () => {
    if (!selectedRequest) return;
    axios
      .post(
        `http://192.168.0.247:3000/api/payment-requests/${selectedRequest.id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Demande rejetée");
        setSelectedRequest(null);
      })
      .catch(console.error);
  };

  return (
    <Modal visible={!!selectedRequest} transparent>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: 20,
        }}
      >
        {selectedRequest && (
          <View
            style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
          >
            <Text>Demande de paiement reçue:</Text>
            <Text>Description: {selectedRequest.description}</Text>
            <Text>Montant: €{selectedRequest.amount}</Text>
            <Button title="Accepter" onPress={handleAccept} />
            <Button title="Refuser" onPress={handleReject} />
          </View>
        )}
      </View>
    </Modal>
  );
}
