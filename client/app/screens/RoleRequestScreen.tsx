import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import TopBar from "../components/TopBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-datetime/css/react-datetime.css";
import { useEffect } from "react";
import ListItem from "../components/ListItem";

import Constants from "expo-constants";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

const RoleRequestScreen = () => {
  const [requests, setRequests] = useState<any>([]);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [isAccepting, setIsAccepting] = useState<boolean>(false);

  const getRequests = async () => {
    const token = await AsyncStorage.getItem("jwtToken");

    try {
      const response = await fetch(`${API_BASE_URL}/roleRequests/getAll`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      setRequests(data);
    } catch (error) {
      console.error("Erreur de connexion", error);
      Alert.alert("Échec de la connexion", "Vérifiez vos identifiants.");
    }
  };

  const accept = async (requestId: number) => {
    setIsAccepting(true);
    const token = await AsyncStorage.getItem("jwtToken");

    try {
      await fetch(`${API_BASE_URL}/roleRequests/acceptRequest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
        }),
      });
      await getRequests();
    } catch (error) {
      console.error("Erreur de connexion", error);
      Alert.alert("Échec de la connexion", "Vérifiez vos identifiants.");
    } finally {
      setIsAccepting(false);
    }
  };

  const reject = async (requestId: number) => {
    setIsRejecting;
    const token = await AsyncStorage.getItem("jwtToken");

    try {
      await fetch(`${API_BASE_URL}/roleRequests/rejectRequest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
        }),
      });
      await getRequests();
    } catch (error) {
      console.error("Erreur de connexion", error);
      Alert.alert("Échec de la connexion", "Vérifiez vos identifiants.");
    } finally {
      setIsRejecting(false);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title="Gestion des demandes" previous="HomeScreen" />
      <ScrollView>
        <View style={{ height: 80 }} />
        {requests && (
          <>
            <View style={styles.tab}>
              <ListItem texts={["User ID", "Statut", "Date de demande"]} />
            </View>
            {requests.map((req: any) => {
              return (
                <View key={req.id} style={styles.tab}>
                  <ListItem
                    texts={[
                      req.userId,
                      req.status,
                      new Date(parseInt(req.date, 10)).toLocaleDateString(
                        "fr-FR"
                      ),
                    ]}
                  />

                  {req.status === "PENDING" && (
                    <View style={styles.buttonsTab}>
                      <Pressable
                        style={({ pressed }) => [
                          styles.acceptButton,
                          pressed && styles.pressed,
                        ]}
                        onPress={() => accept(req.id)}
                      >
                        <Text style={styles.buttonsText}>Accept</Text>
                      </Pressable>
                      <Pressable
                        style={({ pressed }) => [
                          styles.rejectButton,
                          pressed && styles.pressed,
                        ]}
                        onPress={() => reject(req.id)}
                      >
                        <Text style={styles.buttonsText}>Reject</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  tab: {
    padding: 5,
    //marginVertical: 15,
    marginHorizontal: 10,
    borderWidth: 2,
  },
  buttonsTab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  acceptButton: {
    //paddingVertical: 4,
    paddingHorizontal: 20,
    backgroundColor: "#218532",
    borderRadius: 6,
    alignItems: "center",
  },
  rejectButton: {
    //paddingVertical: 4,
    paddingHorizontal: 20,
    backgroundColor: "#a10000",
    borderRadius: 6,
    alignItems: "center",
  },
  buttonsText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  pressed: {
    opacity: 0.6,
  },
});

export default RoleRequestScreen;
