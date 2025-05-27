import { useEffect } from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const SOCKET_URL = (isDevice ? LAN_API : LOCALHOST_API).replace("/api", "");

export default function SocketInitializer() {
  const router = useRouter();

  useEffect(() => {
    let socket: ReturnType<typeof io> | undefined;

    const setup = async () => {
      const rawUser = await AsyncStorage.getItem("userData");
      const user = JSON.parse(rawUser ?? "null");
      if (!user?.id) {
        console.log("Aucun user.id trouvé, socket non initialisé");
        return;
      }

      socket = io(SOCKET_URL, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
      });

      socket.on("connect", () => {
        console.log("✅ [FRONT] Socket connecté :", socket?.id);
        socket?.emit("register", user.id);
      });

      socket.on("connect_error", (err) => {
        console.log("❌ [FRONT] Erreur de connexion socket :", err.message);
      });

      socket.on("newPaymentRequest", (request) => {
        console.log("📨 [FRONT] Paiement reçu :", request);

        Alert.alert(
          "Nouvelle demande de paiement",
          `${request.description} - ${request.amount}€`,
          [
            {
              text: "Voir",
              onPress: () => router.replace("/screens/PaymentInboxScreen"),
            },
            { text: "Ignorer", style: "cancel" },
          ]
        );
      });

      socket.on("disconnect", () => {
        console.log("🔌 Socket déconnecté");
      });
    };

    setup();
  }, []);

  return null;
}
