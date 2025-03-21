import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Utilisation de expo-router

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Envoi des informations de connexion au backend
      const response = await axios.post(
        "http://adresse-ip-de-la-machine:3000/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data.token;
      if (token) {
        // Stocker le token dans AsyncStorage
        await AsyncStorage.setItem("jwtToken", token);

        // Afficher un message de succès
        Alert.alert("Connexion réussie !");

        // Rediriger l'utilisateur vers son profil après connexion réussie
        router.push("/screens/profile");
      }
    } catch (error) {
      console.error("Erreur de connexion", error);
      Alert.alert("Échec de la connexion", "Vérifiez vos identifiants");
    } finally {
      setLoading(false); // Remettre le loading à false après la demande
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? "Connexion..." : "Se connecter"}
        onPress={handleLogin}
        disabled={loading} // Empêche la soumission multiple si la demande est en cours
      />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
