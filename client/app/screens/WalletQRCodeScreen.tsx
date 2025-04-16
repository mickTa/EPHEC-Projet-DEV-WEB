import React, { useState, useEffect } from "react";
import { View, Image, Button, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Wallet {
  id: number;
  userId: number;
  organizerId: number;
  amount: number;
}

const WalletQRCodeScreen = () => {
  const [qrCode, setQrCode] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        const response = await fetch("http://localhost:3000/api/users/me/wallets", {
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
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  const handleGenerateQRCode = async (wallet : Wallet) => {
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
      <Button title="Generate QR Code" onPress={() => handleGenerateQRCode(item)} />
    </View>
  );

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
        <Text>Loading wallets...</Text>
      </View>
    );
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Wallets</Text>
      
      {wallets.length === 0 ? (
        <Text style={styles.emptyText}>No wallets found</Text>
      ) : (
        <FlatList
          data={wallets}
          renderItem={renderWalletItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}

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
                  <Image
                    source={{ uri: qrCode }}
                    style={styles.qrCodeImage}
                  />
                )}
            
            <Text style={styles.qrCodeLabel}>Scanner pour faire un achat !</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  walletItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6c757d',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  qrCodeImage: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  qrCodeLabel: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
export default WalletQRCodeScreen;
