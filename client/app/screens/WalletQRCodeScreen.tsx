import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Button,
  FlatList,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import TopBar from "../components/TopBar";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import Constants from "expo-constants";

const { LOCALHOST_API, LAN_API } = Constants.expoConfig?.extra ?? {};
const isDevice = Constants.platform?.ios || Constants.platform?.android;
const API_BASE_URL = isDevice ? LAN_API : LOCALHOST_API;

interface Wallet {
  id: number;
  userId: number;
  organizerId: number;
  eventId: number;
  amount: number;
}

const WalletQRCodeScreen = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addMoneyModalVisible, setAddMoneyModalVisible] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [amountToAdd, setAmountToAdd] = useState("");

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");

      if (!token) {
        router.replace("/");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/users/me/wallets`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setWallets(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des portefeuilles", error);
      setError("Impossible de récupérer les portefeuilles.");
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        // Token expiré ou invalide
        await AsyncStorage.removeItem("jwtToken");
        Alert.alert("Session expirée", "Veuillez vous reconnecter.");
        router.replace("/");
      } else {
        Alert.alert(
          "Erreur",
          "Une erreur est survenue lors de la récupération de vos données."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQRCode = async (wallet: Wallet) => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-qr`, {
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

  const closeQRModal = () => setQrCode(null);

  const openAddMoneyModal = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setAddMoneyModalVisible(true);
  };

  const handleAddMoney = async () => {
    if (!selectedWallet || !amountToAdd || isNaN(parseFloat(amountToAdd))) {
      alert("Please enter a valid amount and select a wallet.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/wallets/addMoney`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletId: selectedWallet.id,
          amount: amountToAdd, // ensure numeric
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data?.message || "Failed to add money. Please try again.";
        throw new Error(errorMessage);
      }

      // Success case
      fetchWallets();
      setAddMoneyModalVisible(false);
      setAmountToAdd("");
    } catch (err) {
      console.error("Add money error:", err);
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  const renderWalletItem = ({ item }: { item: Wallet }) => (
    <View style={styles.walletItem}>
      <Text>Wallet ID: {item.id}</Text>
      <Text>User ID: {item.userId}</Text>
      <Text>Organizer ID: {item.organizerId}</Text>
      <Text>Event ID: {item.eventId}</Text>
      <Text>Amount: {item.amount}</Text>
      <Button
        title="Générer le QR Code"
        onPress={() => handleGenerateQRCode(item)}
      />
      <Button
        title="Ajouter des crédits"
        onPress={() => openAddMoneyModal(item)}
        color="#4CAF50"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <TopBar title="Porte-monnaies" previous="HomeScreen" />

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
        onRequestClose={closeQRModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeQRModal}>
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

      {/* Add Money Modal */}
      <Modal
        visible={addMoneyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddMoneyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addMoneyModalContent}>
            <Text style={styles.modalTitle}>Ajouter des crédits</Text>

            <Text style={styles.walletInfo}>
              Wallet ID: {selectedWallet?.id}
            </Text>
            <Text style={styles.walletInfo}>
              Current Balance: {selectedWallet?.amount}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={amountToAdd}
              onChangeText={setAmountToAdd}
              autoFocus={true}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setAddMoneyModalVisible(false);
                  setAmountToAdd("");
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  handleAddMoney();
                }}
              >
                <Text style={styles.buttonText}>Add Money</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Layout and container styles
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingTop: 90,
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 20,
  },

  // Wallet item styles
  walletItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },

  // Text styles
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
  walletInfo: {
    marginBottom: 10,
    fontSize: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  qrCodeLabel: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 10,
  },

  // Modal styles
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
  addMoneyModalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
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

  // Input and button styles
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ab202a",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  // QR Code styles
  qrCodeImage: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});

export default WalletQRCodeScreen;
