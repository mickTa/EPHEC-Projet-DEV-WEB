import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function WebViewScreen() {
  const { url } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/screens/HomeScreen");
    }, 5000); // Retour automatique après 5 secondes

    return () => clearTimeout(timeout);
  }, []);

  if (!url || typeof url !== "string") {
    return (
      <View>
        <Text>URL invalide</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView source={{ uri: url }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
