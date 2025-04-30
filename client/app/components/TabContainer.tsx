import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { userDataFetcher } from "../misc/userDataFetcher";
import { useRouter } from "expo-router";

const TabContainer: React.FC = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  const goToHome = () => router.replace("/screens/HomeScreen");
  const goToEvents = () => router.replace("/screens/EventFormScreen");
  const goToWalletQR = () => router.replace("/screens/WalletQRCodeScreen");
  const goToProfile = () => router.replace("/screens/ProfileScreen");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await userDataFetcher(() => {});
        setUserRole(userData?.role || null);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const renderButton = (icon: any, onPress: () => void) => (
    <Pressable onPress={onPress}>
      <Image source={icon} style={styles.icon} />
    </Pressable>
  );

  return (
    <View style={styles.tabsBox}>
      {renderButton(require("../img/home-icon.png"), goToHome)}

      {userRole === "ORGANIZER"
        ? renderButton(require("../img/timetable-icon.png"), goToEvents)
        : userRole === "USER"
        ? renderButton(require("../img/timetable-icon.png"), goToWalletQR)
        : null}

      {renderButton(require("../img/wallet-icon.png"), goToWalletQR)}

      {renderButton(require("../img/scanQrCode-icon.png"), () =>
        router.replace("/screens/SendPaymentRequestScreen")
      )}

      {renderButton(require("../img/profile-icon.png"), goToProfile)}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsBox: {
    width: "100%",
    backgroundColor: "gray",
    height: 60, // Hauteur fixe au lieu de minHeight
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  icon: {
    height: 40,
    width: 40,
  },
});

export default TabContainer;
