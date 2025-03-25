import { useState, useEffect } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { detectWallets, WalletInfo } from '../../utils/walletUtils';

interface WalletModalProps {
  onClose: () => void;
}

export function WalletModal({ onClose }: WalletModalProps) {
  const { connect, disconnect, walletAddress, isConnected, walletType } = useWallet();
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);

  useEffect(() => {
    async function fetchWallets() {
      const wallets = await detectWallets();
      setAvailableWallets(wallets);
    }
    fetchWallets();
  }, []);

  const handleConnect = async (walletName: string) => {
    try {
      await connect(walletName);
      onClose();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      onClose();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return (
    <div className="wallet-modal">
      <div className="wallet-modal-content">
        <h2>Connect Wallet</h2>
        {isConnected ? (
          <div>
            <p>Connected to {walletType}</p>
            <p>Address: {walletAddress}</p>
            <button onClick={handleDisconnect}>Disconnect</button>
          </div>
        ) : (
          <div>
            {availableWallets.map((wallet) => (
              <button key={wallet.name} onClick={() => handleConnect(wallet.name)}>
                Connect to {wallet.name}
              </button>
            ))}
          </div>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}