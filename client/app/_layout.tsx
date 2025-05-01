import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="./RegisterScreen"
      />
      <Stack.Screen
        name="./LoginScreen"
      />
      <Stack.Screen
        name="./ProfileScreen"
      />
      <Stack.Screen
        name="./HomeScreen"
      />
      <Stack.Screen
        name="./WalletQRCodeScreen"
      />
      <Stack.Screen
        name="./EventFormScreen"
      />
      <Stack.Screen
        name="./ModifyPasswordScreen"
      />
    </Stack>
  );
}
