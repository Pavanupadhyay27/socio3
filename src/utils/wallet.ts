export async function connectWallet(walletName: string): Promise<string> {
  try {
    switch (walletName.toLowerCase()) {
      case 'metamask':
        if (window.ethereum?.isMetaMask) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          return accounts[0];
        }
        throw new Error('MetaMask not installed');
      
      // ...existing wallet connection cases...
      
      default:
        throw new Error('Wallet not supported');
    }
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
}

export async function disconnectWallet(walletName: string): Promise<void> {
  try {
    switch (walletName) {
      case 'MetaMask':
        if (window.ethereum?.isMetaMask) {
          await window.ethereum.request({ method: 'wallet_disconnect' });
        }
        break;
      
      // ...existing wallet disconnection cases...
    }
    localStorage.removeItem('connectedWallet');
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    throw error;
  }
}
