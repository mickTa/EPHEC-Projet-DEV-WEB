import React, { useState } from "react";
import { View, Button, Image } from "react-native";

const WalletQRCodeScreen = () => {
  const [qrCode, setQrCode] = useState(null);

  const wallet = {
    id: 1,
    userId: 123,
    organizerId: 456,
    amount: 100.5,
  };

  const handleGenerateQRCode = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/generate-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet }),
      });

      const data = await response.json();
      setQrCode(data.qrCode);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Generate QR Code" onPress={handleGenerateQRCode} />
      {qrCode && (
        <Image
          source={{ uri: qrCode }}
          style={{ width: 200, height: 200, marginTop: 20 }}
        />
      )}
    </View>
  );
};

export default WalletQRCodeScreen;
