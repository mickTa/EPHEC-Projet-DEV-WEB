import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function QrCodeScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  const handleBarCodeScanned = (scanningResult: BarcodeScanningResult) => {
    const { data, type } = scanningResult ?? {};
    if (!scanned && data) {
      setScanned(true);
      console.log(`QR code détecté (${type}): ${data}`);
      try {
        // Vérifie si c’est une URL valide
        const isUrl = /^https?:\/\/.+$/.test(data);
        if (isUrl) {
          router.replace({
            pathname: "/screens/WebViewScreen",
            params: { url: data },
          });
        } else {
          Alert.alert("QR Code", `Données non valides : ${data}`);
        }
      } catch (error) {
        console.error("Erreur de redirection :", error);
      }
    }
  };

  if (!permission) {
    return <Text>Demande d'autorisation en cours...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Accès à la caméra refusé.</Text>
        <Button title="Autoriser la caméra" onPress={requestPermission} />
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

      {/* Overlay : Cadre de scan */}
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
      </View>

      {/* Bouton retour */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/screens/HomeScreen")}
      >
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      {scanned && (
        <Button title="Scanner à nouveau" onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  maskOuter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  maskCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 250,
    height: 250,
    marginLeft: -125,
    marginTop: -125,
    backgroundColor: "transparent",
    zIndex: 1,
  },
});
