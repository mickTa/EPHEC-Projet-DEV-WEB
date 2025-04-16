import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Platform,
} from "react-native";
import { router } from "expo-router";

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/screens/HomeScreen")}
        >
          <Image
            source={require("../img/arrow-left.png")}
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Code du Wallet</Text>
      </View>

      <View style={styles.content}>
        <Button title="Generate QR Code" onPress={handleGenerateQRCode} />
        {qrCode && (
          <Image
            source={{ uri: qrCode }}
            style={{ width: 200, height: 200, marginTop: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    margin: 0,
  },
  backButtonIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WalletQRCodeScreen;
