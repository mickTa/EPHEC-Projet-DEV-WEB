import React, { useEffect, useState } from "react";
import { Camera as RealCamera } from "react-native-vision-camera";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

import Camera from "../components/CameraWrapper";
import {
  useCameraDevices,
  useFrameProcessor,
  useScanBarcodes,
} from "../../hooks/useCamera";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isWeb = Platform.OS === "web";
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

export default function SendPaymentRequestScreen() {
  const router = useRouter();
  const devices = useCameraDevices();
  const device =
    devices.find?.((d: { position: string }) => d.position === "back") ?? null;

  const [hasPermission, setHasPermission] = useState(false);
  const [walletData, setWalletData] = useState<any>(null);
  const [amount, setAmount] = useState("50");
  const [description, setDescription] = useState("Achat de boisson");

  const [barcodes, setBarcodes] = useState<any[]>([]);
  const frameProcessor = useFrameProcessor?.((frame: any) => {
    const [frameProcessorFunction] = useScanBarcodes([
      /* BarcodeFormat.QR_CODE */ "qr",
    ]);
    const scannedBarcodes: any[] = [];
    frameProcessorFunction(frame);
    setBarcodes(scannedBarcodes);
  }, []);

  useEffect(() => {
    if (!isWeb) {
      (async () => {
        const status = await RealCamera.requestCameraPermission();
        setHasPermission(status === "granted");
      })();
    }
  }, []);

  useEffect(() => {
    if (barcodes.length > 0 && !walletData) {
      Alert.alert(
        "Scan désactivé",
        "Le scan de QR code est momentanément indisponible."
      );
      // Tu pourrais aussi setWalletData manuellement ici si besoin
    }
  }, [barcodes]);

  const handleSendRequest = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");

      await axios.post(
        `${API_BASE_URL}/payment-request`,
        {
          userId: walletData.userId,
          organizerId: 3,
          eventId: 1,
          amount: parseFloat(amount),
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Succès", "Demande de paiement envoyée !");
      setWalletData(null);
    } catch (error) {
      console.error("Erreur d'envoi :", error);
      Alert.alert("Erreur", "Impossible d’envoyer la demande.");
    }
  };

  if (isWeb) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ textAlign: "center", marginTop: 100, fontSize: 18 }}>
          ⚠️ Le scan de QR Code n'est pas disponible sur la version Web.
        </Text>
      </SafeAreaView>
    );
  }

  if (!device || !hasPermission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ textAlign: "center", marginTop: 100 }}>
          Chargement caméra...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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
        <Text style={styles.headerTitle}>Demande de paiement</Text>
      </View>

      <View style={styles.content}>
        {!walletData ? (
          <>
            <Text style={styles.instruction}>Scannez un portefeuille :</Text>
            <Camera
              style={styles.camera}
              device={device}
              isActive={true}
              frameProcessor={frameProcessor}
            />
            <Button
              title="Réinitialiser le scan"
              onPress={() => setWalletData(null)}
            />
          </>
        ) : (
          <>
            <Text style={styles.label}>Montant (€)</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
            />
            <Button title="Envoyer la demande" onPress={handleSendRequest} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
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
    marginLeft: 30,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    marginTop: 100,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  camera: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
});
