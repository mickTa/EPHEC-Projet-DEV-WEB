import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Erreur", "Tous les champs sont requis.");
      return;
    }

    setLoading(true);
    try {
      // Log pour vérifier les données envoyées
      console.log("Données envoyées:", { fullName, email, password });

      const response = await axios.post(
        "http://adresse-de-la-machine:3000/users",
        {
          fullName,
          email,
          password,
        }
      );

      console.log("Réponse du serveur:", response.data);

      if (response.status === 201) {
        Alert.alert("Inscription réussie !");
        router.push("/screens/LoginScreen"); // Rediriger vers la page de login après l'inscription
      } else {
        Alert.alert("Échec de l'inscription", "Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur d'inscription", error);

      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Erreur d'inscription",
          error.response?.data.error || "Une erreur est survenue."
        );
      } else {
        Alert.alert("Erreur", "Problème de connexion avec le serveur.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom Complet"
        value={fullName}
        onChangeText={setFullName}
      />
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
        title={loading ? "Inscription..." : "S'inscrire"}
        onPress={handleRegister}
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
