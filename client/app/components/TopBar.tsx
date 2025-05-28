import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TopBarProps {
  title: string;
  previous?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title, previous = "HomeScreen" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isHomeScreen = pathname === "/screens/HomeScreen";

  const [menuVisible, setMenuVisible] = useState(false);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const userData = JSON.parse(
        (await AsyncStorage.getItem("userData")) ?? "null"
      );
      if (userData?.role === "USER") {
        setIsUser(true);
      }
    };
    checkRole();
  }, []);

  const toggleMenu = () => setMenuVisible((v) => !v);

  const navigateTo = (path: string) => {
    setMenuVisible(false);
    router.push(path as any);
  };

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

      {isHomeScreen && isUser ? (
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.menuPlaceholder} />
      )}

      <Modal
        visible={menuVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuDrawer}>
            <Text style={styles.drawerTitle}>Menu</Text>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateTo("/screens/PaymentInboxScreen")}
            >
              <Text style={styles.drawerText}>Mes demandes de paiements</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    marginRight: 10,
  },
  backButtonIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 24,
  },
  menuButton: {
    padding: 6,
  },
  menuIcon: {
    fontSize: 24,
    fontWeight: "bold",
    right: 325,
  },
  menuPlaceholder: {
    width: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    flexDirection: "row",
  },

  menuDrawer: {
    width: "70%",
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,

    shadowOffset: { width: 2, height: 0 },
  },

  drawerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  drawerItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  drawerText: {
    fontSize: 16,
  },
});
