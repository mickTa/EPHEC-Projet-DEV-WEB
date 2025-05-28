import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const SOCKET_URL = (isDevice ? LAN_API : LOCALHOST_API).replace("/api", "");

let socketInstance: Socket | null = null;

export default function useSocket(onReady?: (socket: Socket) => void) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      const user = JSON.parse(
        (await AsyncStorage.getItem("userData")) ?? "null"
      );
      if (!user?.id) return;

      // Crée le socket une seule fois globalement
      if (!socketInstance) {
        socketInstance = io(SOCKET_URL, {
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
        });

        socketInstance.on("connect", () => {
          console.log("🔗 Socket connecté :", socketInstance?.id);
          socketInstance?.emit("register", user.id);
        });

        socketInstance.on("disconnect", () => {
          console.log("🚫 Socket déconnecté");
        });
      }

      if (onReady && socketInstance) onReady(socketInstance);
    };

    init();

    return () => {};
  }, [onReady]);
}
