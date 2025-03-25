interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    isCoinbaseWallet?: boolean;
    isTrust?: boolean;
    providers?: any[];
    request: (args: { method: string; params?: any[] }) => Promise<any>;
  };
  solana?: any;
  phantom?: {
    solana?: any;
  };
  coinbaseWallet?: any;
  trustWallet?: any;
  keplr?: any;
  getOfflineSigner?: any;
  okxwallet?: any;
  okex?: any;
  sui?: {
    isConnected: () => Promise<boolean>;
    connect: () => Promise<{ address: string }>;
    disconnect: () => Promise<void>;
  };
  suiWallet?: any;
}
