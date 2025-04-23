import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="screens/RegisterScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="screens/LoginScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="screens/ProfileScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="screens/HomeScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="screens/WalletQRCodeScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="screens/EventFormScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="screens/ModifyPasswordScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="screens/SendPaymentRequestScreen"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
