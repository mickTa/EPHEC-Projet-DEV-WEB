import { useEffect } from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const SOCKET_URL = (isDevice ? LAN_API : LOCALHOST_API).replace("/api", "");

export default function SocketInitializer() {
  useEffect(() => {
    const setup = async () => {
      const user = JSON.parse(
        (await AsyncStorage.getItem("userData")) ?? "null"
      );
      if (!user?.id) return;

      const socket = io(SOCKET_URL, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
      });

      socket.on("connect", () => {
        console.log("✅ Socket global connecté :", socket.id);
        socket.emit("register", user.id);
      });

      socket.on("newPaymentRequest", (request) => {
        console.log("📨 Demande de paiement reçue globalement :", request);
        // Optionnel : afficher une notif, stocker, ou router
      });

      socket.on("disconnect", () => {
        console.log("🔌 Socket déconnecté");
      });
    };

    setup();
  }, []);

  return null; // Pas d'affichage à l'écran
}
