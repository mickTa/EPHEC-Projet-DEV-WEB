import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { userDataFetcher } from "../../misc/userDataFetcher";
import { useRouter, usePathname } from "expo-router";

const TabContainer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

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

  const renderButton = (
    icon: any,
    targetPath:
      | "/screens/HomeScreen"
      | "/screens/EventFormScreen"
      | "/screens/WalletQRCodeScreen"
      | "/screens/SendPaymentRequestScreen"
      | "/screens/ProfileScreen"
  ) => (
    <Pressable
      onPress={
        pathname === targetPath
          ? undefined
          : () => router.replace(targetPath as any)
      }
    >
      <Image source={icon} style={styles.icon} />
    </Pressable>
  );

  return (
    <View style={styles.footer}>
      <View style={styles.tabsBox}>
        {renderButton(require("../img/home-icon.png"), "/screens/HomeScreen")}

        {userRole === "ORGANIZER" &&
          renderButton(
            require("../img/timetable-icon.png"),
            "/screens/EventFormScreen"
          )}

        {userRole === "USER" &&
          renderButton(
            require("../img/wallet-icon.png"),
            "/screens/WalletQRCodeScreen"
          )}

        {renderButton(
          require("../img/scanQrCode-icon.png"),
          "/screens/SendPaymentRequestScreen"
        )}

        {renderButton(
          require("../img/profile-icon.png"),
          "/screens/ProfileScreen"
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsBox: {
    width: "100%",
    backgroundColor: "gray",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  icon: {
    height: 40,
    width: 40,
  },
  footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "white",
  },
});

export default TabContainer;
