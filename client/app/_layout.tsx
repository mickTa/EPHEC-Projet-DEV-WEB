import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="screens/RegisterScreen"
        options={{ title: "Inscription" }}
      />
      <Stack.Screen
        name="screens/LoginScreen"
        options={{ title: "Connexion" }}
      />
      <Stack.Screen
        name="screens/ProfileScreen"
        options={{ title: "Mon Profil" }}
      />
      <Stack.Screen name="screens/HomeScreen" options={{ title: "Accueil" }} />
      <Stack.Screen
        name="screens/WalletQRCodeScreen"
        options={{ title: "Portefeuille" }}
      />
    </Stack>
  );
}
