import QRCode from 'qrcode';

export const generateWalletQRCode = async (wallet) => {
    try {
        const walletData = {
            id: wallet.id,
            userId: wallet.userId,
            paymentGroupId: wallet.paymentGroupId,
            amount: wallet.amount,
            createdAt: wallet.createdAt,
            updatedAt: wallet.updatedAt
        };
        
        const qrData = JSON.stringify(walletData);
        const qrCode = await QRCode.toDataURL(qrData);
        
        return qrCode;
    } catch (error) {
        console.error("QR Code Generation Error:", error);
        throw error;
    }
};