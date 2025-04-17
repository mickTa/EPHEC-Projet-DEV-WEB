import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Button,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface Wallet {
  id: number;
  userId: number;
  organizerId: number;
  amount: number;
}

const WalletQRCodeScreen = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        const response = await fetch(
          "http://localhost:3000/api/users/me/wallets",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setWallets(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des portefeuilles",
          error
        );
        setError("Impossible de récupérer les portefeuilles.");
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  const handleGenerateQRCode = async (wallet: Wallet) => {
    try {
      const response = await fetch("http://localhost:3000/api/generate-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet }),
      });

      const data = await response.json();
      setQrCode(data.qrCode);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const closeModal = () => setQrCode(null);

  const renderWalletItem = ({ item }: { item: Wallet }) => (
    <View style={styles.walletItem}>
      <Text>Wallet ID: {item.id}</Text>
      <Text>User ID: {item.userId}</Text>
      <Text>Organizer ID: {item.organizerId}</Text>
      <Text>Amount: {item.amount}</Text>
      <Button
        title="Générer le QR Code"
        onPress={() => handleGenerateQRCode(item)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/screens/HomeScreen")}
        >
          <Image
            source={require("../img/arrow-left.png")}
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Wallets</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" />
            <Text>Chargement des wallets...</Text>
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : wallets.length === 0 ? (
          <Text style={styles.emptyText}>Aucun wallet trouvé</Text>
        ) : (
          <FlatList
            data={wallets}
            renderItem={renderWalletItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* QR Code Modal */}
      <Modal
        visible={!!qrCode}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {qrCode && (
              <Image source={{ uri: qrCode }} style={styles.qrCodeImage} />
            )}

            <Text style={styles.qrCodeLabel}>
              Scanner pour faire un achat !
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    textAlign: "center",
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 90,
    paddingHorizontal: 16,
  },
  walletItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  listContent: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#6c757d",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  qrCodeImage: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  qrCodeLabel: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

export default WalletQRCodeScreen;
