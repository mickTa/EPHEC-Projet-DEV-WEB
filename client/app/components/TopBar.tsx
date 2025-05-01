import React from "react";
import { Text, StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { useRouter, usePathname } from "expo-router";

interface TopBarProps {
  title: string;
  previous: string;
}

const TopBar: React.FC<TopBarProps> = ({ title, previous = "HomeScreen" }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isHomeScreen = pathname === "/screens/HomeScreen";

  return (
    <View style={styles.header}>
      {isHomeScreen ? (
        <View style={styles.placeholder} />
      ) : (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            router.replace(`/screens/${previous}` as any);
          }}
        >
          <Image
            source={require("../img/arrow-left.png")}
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  backButton: {
    marginRight: 20,
  },
  backButtonIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  placeholder: {
    height: 24,
  },
});
