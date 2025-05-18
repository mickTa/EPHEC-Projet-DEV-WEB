import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="screens/RegisterScreen" />
      <Stack.Screen name="screens/LoginScreen" />
      <Stack.Screen name="screens/ProfileScreen" />
      <Stack.Screen name="screens/HomeScreen" />
      <Stack.Screen name="screens/WalletQRCodeScreen" />
      <Stack.Screen name="screens/EventFormScreen" />
      <Stack.Screen name="screens/ModifyPasswordScreen" />
      <Stack.Screen name="screens/QrCodeScanner" />
      <Stack.Screen name="screens/EventScreen" />
      <Stack.Screen name="screens/EventManagementScreen" />
      <Stack.Screen name="screens/ManualPaymentFormScreen" />
    </Stack>
  );
}
