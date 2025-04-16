import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from "react-native";
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
      const response = await axios.post("http://localhost:3000/api/users", {
        fullName,
        email,
        password,
      });

      if (response.status === 201) {
        Alert.alert("Inscription réussie !");
        router.replace("/"); // Rediriger vers la page de login
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
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/")}
      >
        <Image
          source={require("../img/arrow-left.png")}
          style={styles.backButtonIcon}
        />
      </TouchableOpacity>

      <View style={styles.content}>
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

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#007bff"
            style={{ marginTop: 20 }}
          />
        ) : (
          <Button title="S'inscrire" onPress={handleRegister} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    zIndex: 10,
  },
  backButtonIcon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});
