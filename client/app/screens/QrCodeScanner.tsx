import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Constants from "expo-constants";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

export default function QrCodeScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  const handleBarCodeScanned = async (
    scanningResult: BarcodeScanningResult
  ) => {
    const { data } = scanningResult ?? {};

    if (!data || scanned) return;

    setScanned(true);
    console.log("QR détecté :", data);

    try {
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) {
        Alert.alert("Erreur", "Token manquant");
        return;
      }

      // Déchiffrement
      const decryptRes = await axios.post(
        `${API_BASE_URL}/decrypt-qr`,
        { encryptedData: data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const walletData = decryptRes.data.walletData;
      if (!walletData) {
        Alert.alert("Erreur", "QR code invalide ou expiré.");
        return;
      }

      const { userId, organizerId, id, eventId } = walletData;
      console.log("🔓 WalletData:", walletData);

      router.replace({
        pathname: "/screens/ManualPaymentFormScreen",
        params: { userId, organizerId, walletId: id, eventId },
      });
    } catch (error) {
      console.error("Erreur QR Scan:", error);
      Alert.alert("Erreur", "Impossible de traiter le QR code.");
      setScanned(false);
    }
  };

  if (!permission) return <Text>Demande de permission caméra...</Text>;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Accès caméra refusé.</Text>
        <Button title="Autoriser" onPress={requestPermission} />
        {Platform.OS === "web" && (
          <TouchableOpacity
            style={styles.backToHomeButton}
            onPress={() => router.replace("/screens/HomeScreen")}
          >
            <Text style={styles.backToHomeButtonText}>Retour à l'accueil</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      <View style={styles.overlay}>
        <View style={styles.scanBox} />
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/screens/HomeScreen")}
      >
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <TouchableOpacity>
        {scanned && (
          <Button
            title="Scanner à nouveau"
            onPress={() => {
              setScanned(false);
              router.replace("/screens/QrCodeScanner");
            }}
          />
        )}
      </TouchableOpacity>
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
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 10,
    borderRadius: 20,
    zIndex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
    backgroundColor: "transparent",
    zIndex: 2,
  },
  backToHomeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  backToHomeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
