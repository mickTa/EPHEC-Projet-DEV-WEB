import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import TopBar from "../components/TopBar";
import EventContainer from "../components/EventContainer";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import Constants from "expo-constants";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

interface UserData {
  fullName: string;
  email: string;
  role: string;
  id: number;
}

interface EventInfo{
  id: number;
  name:string;
  description:string
  imageUrl?: string;
}

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribedEventLoading, setSubscribedEventLoading] = useState(true);
  const [organizedEventLoading, setOrganizedEventLoading] = useState(true);
  const[subscribedEvents,setSubscribedEvents]=useState<EventInfo[]>([]);
  const[organizedEvents,setOrganizedEvents]=useState<EventInfo[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    const fetchUserData = async () => {
      setUserData(JSON.parse(await AsyncStorage.getItem("userData")??"null"));
      setLoading(false);
    };
    
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchMySubscribedEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/events/subscribed`, {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        });
        setSubscribedEvents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements", error);
      }
    };

    const fetchMyOrganizedEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/events/organized`, {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        });
        setOrganizedEvents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements", error);
      }
    };

    if(userData?.role=="USER")fetchMySubscribedEvents().then(()=>{setSubscribedEventLoading(false)});
    if(userData?.role=="ORGANIZER")fetchMyOrganizedEvents().then(()=>{setOrganizedEventLoading(false)});
  }, [userData]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("jwtToken");
      await AsyncStorage.removeItem("userData");
      router.replace("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  const requestOrganizerRole = async () => {

    const token = await AsyncStorage.getItem("jwtToken");

    try {
      await fetch(`${API_BASE_URL}/users/requestRole`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "ORGANIZER"
        }),
      });
    } catch (error) {
      console.error("Impossible de demander le rôle organisateur", error);
    }
  };

  if (loading)
    return (
      <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title="Mon profil" previous="HomeScreen" />
      {userData?
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.profilePic} />
            <Text style={styles.title}>Bienvenue, {userData.fullName}!</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.info}>Email : {userData.email}</Text>
            <Text style={styles.info}>Rôle : {userData.role}</Text>
            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={() => router.replace("/screens/ModifyPasswordScreen")}
            >
              <Text style={styles.changePasswordText}>
                Modifier le mot de passe
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={() => requestOrganizerRole()}
            >
              <Text style={styles.changePasswordText}>
                Demander à être organisateur
              </Text>
            </TouchableOpacity>
          </View>

          

          <View style={styles.card}>
            <Text style={styles.subtitle}>Vos derniers achats :</Text>
            <View style={styles.inlineEvent}>
              <Text>Event #1 : Event name</Text>
              <Text>0,00€</Text>
            </View>
            <View style={styles.inlineEvent}>
              <Text>Event #2 : Event name</Text>
              <Text>10,00€</Text>
            </View>
            <View style={styles.inlineEvent}>
              <Text>Event #3 : Event name</Text>
              <Text>50,00€</Text>
            </View>
          </View>
          <View style={styles.events}>
          {userData?.role=="USER" ? (
            <>
              <Text style={styles.title}>Mes inscriptions</Text>
              {subscribedEventLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                subscribedEvents.map((event) => (
                  <TouchableOpacity
                    key={event.id}
                    onPress={() => {
                      router.push(`/screens/EventScreen?id=${event.id}`);
                    }}
                  >
                    <EventContainer
                      title={event.name}
                      text={event.description}
                      image={event.imageUrl || undefined}
                    />
                  </TouchableOpacity>
                ))
              )}
            </>
          ) : (
            <></>
          )}
          {userData?.role=="ORGANIZER" ? (
            <>
              <Text style={styles.title}>Mes organisations</Text>
              {organizedEventLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                organizedEvents.map((event) => (
                  <TouchableOpacity
                    key={event.id}
                    onPress={() => {
                      router.push(`/screens/EventManagementScreen?id=${event.id}`);
                    }}
                  >
                    <EventContainer
                      title={event.name}
                      text={event.description}
                      image={event.imageUrl || undefined}
                    />
                  </TouchableOpacity>
                ))
              )}
            </>
          ) : (
            <></>
          )}
        </View>
        </ScrollView>
      :
        <Text style={styles.noData}>Impossible de charger les informations de l'utilisateur</Text>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContent: {
    padding: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  logoutButton: {
    marginTop: 60,
    backgroundColor: "#ff4d4d",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
  profileInfo: {
    alignItems: "center",
    marginVertical: 20,
  },
  profilePic: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: "#ccc",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    elevation: 3,
    marginVertical: 12,
  },
  changePasswordButton: {
    marginTop: 15,
    backgroundColor: "#4682B4",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  changePasswordText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  inlineEvent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  noData:{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    fontSize: 20,
    fontWeight: "bold",
  },
  events: {
    flex: 1,
    margin: 20,
    alignItems: "center",
    gap: 30,
  },
});
