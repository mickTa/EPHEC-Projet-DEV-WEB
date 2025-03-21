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
      <Stack.Screen name="screens/profile" options={{ title: "Mon Profil" }} />
    </Stack>
  );
}
