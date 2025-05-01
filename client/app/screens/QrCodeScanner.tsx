import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import Camera from "../components/CameraWrapper";
import { useCameraDevices } from "../../hooks/useCamera";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isWeb = Platform.OS === "web";
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

export default function QrCodeScanner() {
  const router = useRouter();
  const devices = useCameraDevices();
  const device =
    devices.find?.((d: { position: string }) => d.position === "back") ?? null;

  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (!isWeb) {
      (async () => {
        const { Camera } = await import("react-native-vision-camera");
        const status = await Camera.requestCameraPermission();
        setHasPermission(status === "granted");
      })();
    }
  }, []);

  if (isWeb) {
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
          <Text style={{ textAlign: "center", fontSize: 18 }}>
            ⚠️ Le scan de QR Code n'est pas disponible sur la version Web.
          </Text>
        </View>
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
    <View style={styles.fullScreen}>
      <Camera style={styles.cameraFull} device={device} isActive={true} />

      {/* UI superposé */}
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

      <View style={styles.overlay}>
        <Text style={styles.instruction}>Scannez un portefeuille :</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    position: "relative",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  cameraFull: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
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
    backgroundColor: "rgba(255,255,255,0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    marginTop: 100,
  },
  overlay: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  instruction: {
    fontSize: 16,
    textAlign: "center",
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 8,
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
});
