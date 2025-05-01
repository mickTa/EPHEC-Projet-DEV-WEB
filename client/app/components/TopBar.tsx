import React from "react";
import { Text, StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { useRouter, usePathname } from "expo-router";

interface TopBarProps {
  title: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isHomeScreen = pathname === "/screens/HomeScreen";
  const isModifyPasswordScreen = pathname === "/screens/ModifyPasswordScreen";

  const handleBack = () => {
    if (isModifyPasswordScreen) {
      router.replace("/screens/ProfileScreen");
    } else {
      router.replace("/screens/HomeScreen");
    }
  };

  return (
    <View style={styles.header}>
      {!isHomeScreen ? (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image
            source={require("../img/arrow-left.png")}
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    elevation: 3,
  },
  backButton: {
    padding: 4,
  },
  backButtonIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  placeholder: {
    width: 24,
  },
});
