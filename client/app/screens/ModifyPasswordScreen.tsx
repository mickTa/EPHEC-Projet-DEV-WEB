import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";

export default function ModifyPasswordScreen() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return Alert.alert("Erreur", "Tous les champs sont obligatoires.");
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert("Erreur", "Les nouveaux mots de passe ne correspondent pas.");
    }

    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir changer votre mot de passe ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Confirmer",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("jwtToken");
              const response = await axios.post(
                "http://192.168.129.117:3000/users/changePassword",
                {
                  oldPassword,
                  newPassword,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (response.status === 200) {
                Alert.alert("Succès", "Mot de passe modifié avec succès !");
                router.back();
              } else {
                Alert.alert("Erreur", "Échec du changement de mot de passe.");
              }
            } catch (error) {
              console.error("Erreur lors du changement de mot de passe:", error);
              Alert.alert("Erreur", "Vérifiez l'ancien mot de passe ou réessayez.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier le mot de passe</Text>

      <TextInput
        style={styles.input}
        placeholder="Ancien mot de passe"
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Nouveau mot de passe"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmer le nouveau mot de passe"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={styles.changePasswordButton}
        onPress={handleChangePassword}
      >
        <Text style={styles.changePasswordText}>Changer le mot de passe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  changePasswordButton: {
    marginTop: 10,
    backgroundColor: "#4682B4",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  changePasswordText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
