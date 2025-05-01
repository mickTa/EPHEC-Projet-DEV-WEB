import React from "react";
import { useRouter } from "expo-router";
import { Text, StyleSheet, TouchableOpacity, View, Image } from "react-native";
//import { useNavigation,useNavigationContainerRef  } from '@react-navigation/native';
import { useNavigation, useNavigationContainerRef } from "expo-router";

interface TopBarTitle {
  title: string;
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    elevation: 3,
  },
  backButton: {
    margin: 0,
  },
  backButtonIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -50 }],
  },
});

const TopBar: React.FC<TopBarTitle> = ({ title }) => {
  const navigation = useNavigation();
  const router = useRouter();
  return (
    <View style={styles.header}>
      {navigation.canGoBack() ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            router.back();
          }}
        >
          <Image
            source={require("../img/arrow-left.png")}
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButtonIcon} />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

export default TopBar;
