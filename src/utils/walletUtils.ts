export interface WalletInfo {
  name: string;
  icon: string;
  color: string;
  isInstalled: boolean;
  identifier: string;
  isConnected?: boolean;
}

export const detectWallets = async (): Promise<WalletInfo[]> => {
  const wallets: WalletInfo[] = [
    {
      name: 'MetaMask',
      icon: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjM1NSIgdmlld0JveD0iMCAwIDM5NyAzNTUiIHdpZHRoPSIzOTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMSAtMSkiPjxwYXRoIGQ9Im0xMTQuNjIyNjQ0IDMyNy4xOTU0NzIgNTIuMDA0NzE3IDEzLjgxMDE5OHYtMTguMDU5NDlsNC4yNDUyODMtNC4yNDkyOTJoMjkuNzE2OTgydjIxLjI0NjQ1OSAxNC44NzI1MjNoLTMxLjgzOTYyNGwtMzkuMjY4ODY4LTE2Ljk5NzE2OXoiIGZpbGw9IiNjZGJkYjIiLz48cGF0aCBkPSJtMTk5LjUyODMwNSAzMjcuMTk1NDcyIDUwLjk0MzM5NyAxMy44MTAxOTh2LTE4LjA1OTQ5bDQuMjQ1MjgzLTQuMjQ5MjkyaDI5LjcxNjk4MXYyMS4yNDY0NTkgMTQuODcyNTIzaC0zMS44Mzk2MjNsLTM5LjI2ODg2OC0xNi45OTcxNjl6IiBmaWxsPSIjY2RiZGIyIiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSA0ODMuOTYyMjcgMCkiLz48cGF0aCBkPSJtMTcwLjg3MjY0NCAyODcuODg5NTIzLTQuMjQ1MjgzIDM1LjA1NjY1NyA1LjMwNjYwNC00LjI0OTI5Mmg1NS4xODg2OGw2LjM2NzkyNSA0LjI0OTI5Mi00LjI0NTI4NC0zNS4wNTY2NTctOC40OTA1NjUtNS4zMTE2MTUtNDIuNDUyODMyIDEuMDYyMzIzeiIgZmlsbD0iIzM5MzkzOSIvPjxwYXRoIGQ9Im0xNDIuMjE2OTg0IDUwLjk5MTUwMjIgMjUuNDcxNjk4IDU5LjQ5MDA4NTggMTEuNjc0NTI4IDE3My4xNTg2NDNoNDEuMzkxNTExbDEyLjczNTg0OS0xNzMuMTU4NjQzIDIzLjM0OTA1Ni01OS40OTAwODU4eiIgZmlsbD0iI2Y4OWMzNSIvPjxwYXRoIGQ9Im0zMC43NzgzMDIzIDE4MS42NTcyMjYtMjkuNzE2OTgxNTMgODYuMDQ4MTYxIDc0LjI5MjQ1MzkzLTQuMjQ5MjkzaDQ3Ljc1OTQzNDN2LTM3LjE4MTMwM2wtMi4xMjI2NDEtNzYuNDg3MjUzLTEwLjYxMzIwOCA4LjQ5ODU4M3oiIGZpbGw9IiNmODlkMzUiLz48cGF0aCBkPSJtODcuMDI4MzAzMiAxOTEuMjE4MTM0IDg3LjAyODMwMjggMi4xMjQ2NDYtOS41NTE4ODYgNDQuNjE3NTYzLTQxLjM5MTUxMS0xMC42MjMyMjl6IiBmaWxsPSIjZDg3YzMwIi8+PHBhdGggZD0ibTg3LjAyODMwMzIgMTkyLjI4MDQ1NyAzNi4wODQ5MDU4IDMzLjk5NDMzNHYzMy45OTQzMzR6IiBmaWxsPSIjZWE4ZDNhIi8+PHBhdGggZD0ibTEyMy4xMTMyMDkgMjI3LjMzNzExNCA0Mi40NTI4MzEgMTAuNjIzMjI5IDEzLjc5NzE3IDQ1LjY3OTg4OC05LjU1MTg4NiA1LjMxMTYxNS00Ni42OTgxMTUtMjcuNjIwMzk4eiIgZmlsbD0iI2Y4OWQzNSIvPjxwYXRoIGQ9Im0xMjMuMTEzMjA5IDI2MS4zMzE0NDgtOC40OTA1NjUgNjUuODY0MDI0IDU2LjI1LTM5LjMwNTk0OXoiIGZpbGw9IiNlYjhmMzUiLz48cGF0aCBkPSJtMTc0LjA1NjYwNiAxOTMuMzQyNzggNS4zMDY2MDQgOTAuMjk3NDUxLTE1LjkxOTgxMi00Ni4yMTEwNDl6IiBmaWxsPSIjZWE4ZTNhIi8+PHBhdGggZD0ibTc0LjI5MjQ1MzkgMjYyLjM5Mzc3MSA0OC44MjA3NTUxLTEuMDYyMzIzLTguNDkwNTY1IDY1Ljg2NDAyNHoiIGZpbGw9IiNkODdjMzAiLz48cGF0aCBkPSJtMjQuNDEwMzc3NyAzNTUuODc4MTkzIDkwLjIxMjI2NjMtMjguNjgyNzIxLTQwLjMzMDE5MDEtNjQuODAxNzAxLTczLjIzMTEzMzEzIDUuMzExNjE2eiIgZmlsbD0iI2ViOGYzNSIvPjxwYXRoIGQ9Im0xNjcuNjg4NjgyIDExMC40ODE1ODgtNDUuNjM2NzkzIDM4LjI0MzYyNy0zNS4wMjM1ODU4IDQyLjQ5MjkxOSA4Ny4wMjgzMDI4IDMuMTg2OTY5eiIgZmlsbD0iI2U4ODIxZSIvPjxwYXRoIGQ9Im0xMTQuNjIyNjQ0IDMyNy4xOTU0NzIgNTYuMjUtMzkuMzA1OTQ5LTQuMjQ1MjgzIDMzLjk5NDMzNHYxOS4xMjE4MTNsLTM4LjIwNzU0OC03LjQzNjI2eiIgZmlsbD0iI2RmY2VjMyIvPjxwYXRoIGQ9Im0yMjkuMjQ1Mjg2IDMyNy4xOTU0NzIgNTUuMTg4NjgtMzkuMzA1OTQ5LTQuMjQ1MjgzIDMzLjk5NDMzNHYxOS4xMjE4MTNsLTM4LjIwNzU0OC03LjQzNjI2eiIgZmlsbD0iI2RmYVjMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgNTEzLjY3OTI1MiAwKSIvPjxwYXRoIGQ9Im0xMzIuNjY1MDk2IDIxMi40NjQ1OTMtMTEuNjc0NTI4IDI0LjQzMzcgNDEuMzkxNTEtMTAuNjIzMjI5eiIgZmlsbD0iIzM5MzkzOSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjgzLjM3MjY0NiAwKSIvPjxwYXRoIGQ9Im0yMy4zNDkwNTcgMS4wNjIzMjI5NiAxNDQuMzM5NjI1IDEwOS40MTkyNjUwNC0yNC40MTAzNzgtNTkuNDkwMDg1OHoiIGZpbGw9IiNlODgyMWUiLz48cGF0aCBkPSJtMjMuMzQ5MDU3IDEuMDYyMzIyOTYtMTkuMTAzNzczOTIgNTguNDI3NzYyOTQgMTAuNjEzMjA3NzIgNjMuNzM5Mzc4MS03LjQyOTI0NTQxIDQuMjQ5MjkyIDEwLjYxMzIwNzcxIDkuNTYwOTA2LTguNDkwNTY2MTcgNy40MzYyNjEgMTEuNjc0NTI4NDcgMTAuNjIzMjI5LTcuNDI5MjQ1NCA2LjM3MzkzOCAxNi45ODExMzIzIDIxLjI0NjQ1OSA3OS41OTkwNTctMjQuNDMzNy0xMS42NzQ1MjgtNzYuNDg3MjUzIDIyLjI4NzczOS0zMS44Njk2ODgtMTIuNzM1ODQ5LTI3LjYyMDM5OHoiIGZpbGw9IiNlODgyMWUiLz48cGF0aCBkPSJtMTc3LjE3OTI0OCAyNTEuNzcwNTQyLTI4Ljc1NTY2IDEwLjYyMzIyOSA1NS4xODg2OC0zOC4yNDM2MjZ6IiBmaWxsPSIjMzkzOTM5Ii8+PHBhdGggZD0ibTE5MC45NzcwNzggMjYyLjM5Mzc3MSA4LjQ5MDU2NSA2NC44MDE3MDEtMzcuMTQ2MjI2LTQ2Ljc0MjM3MnpNMTQ5LjU4NDkzMyAyOTYuMzg4MTA1IDEzNy45MSAzNDcuMzc5NDUxbDM3LjE0NjIyNy0zOS4zMDU5NDh6IiBmaWxsPSIjZTg4MjFlIi8+PC9nPjwvc3ZnPg==',
      color: '#E8831D',
      isInstalled: typeof window !== 'undefined' && (!!window.ethereum?.isMetaMask),
      identifier: 'metamask'
    },
    {
      name: 'Phantom',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xXzUxKSIvPgo8cGF0aCBkPSJNMTEwLjUyNCA2NC4zMDIzQzExMC41MjQgODkuNzYxMSA4OS43NjExIDExMC41MjQgNjQuMzAyMyAxMTAuNTI0QzM4Ljg0MzUgMTEwLjUyNCAxOC4wODA2IDg5Ljc2MTEgMTguMDgwNiA2NC4zMDIzQzE4LjA4MDYgMzguODQzNSAzOC44NDM1IDE4LjA4MDYgNjQuMzAyMyAxOC4wODA2QzM4Ljg0MzUgMTguMDgwNiAxOC4wODA2IDM4Ljg0MzUgMTguMDgwNiA2NC4zMDIzQzE4LjA4MDYgODkuNzYxMSAzOC44NDM1IDExMC41MjQgNjQuMzAyMyAxMTAuNTI0Qzg5Ljc2MTEgMTEwLjUyNCAxMTAuNTI0IDg5Ljc2MTEgMTEwLjUyNCA2NC4zMDIzWiIgZmlsbD0iIzUzM0E3MSIvPgo8L3N2Zz4=',
      color: '#AB9FF2',
      isInstalled: typeof window !== 'undefined' && (!!window.solana || !!window.phantom?.solana),
      identifier: 'phantom'
    },
    {
      name: 'Coinbase',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzAwNTJGRiIvPjxwYXRoIGQ9Ik0xNiA2QzEwLjQ3NzEgNiA2IDEwLjQ3NzEgNiAxNkM2IDIxLjUyMjkgMTAuNDc3MSAyNiAxNiAyNkMyMS41MjI5IDI2IDI2IDIxLjUyMjkgMjYgMTZDMjYgMTAuNDc3MSAyMS41MjI5IDYgMTYgNloiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
      color: '#0052FF',
      isInstalled: typeof window !== 'undefined' && (!!window.ethereum?.isCoinbaseWallet || !!window.coinbaseWallet),
      identifier: 'coinbase'
    },
    {
      name: 'Trust Wallet',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMkwxMCA2VjE2QzEwIDI0LjgzNjYgMTQuMjQ4IDMwLjg1OTkgMjAgMzRDMjUuNzUyIDMwLjg1OTkgMzAgMjQuODM2NiAzMCAxNlY2TDIwIDJaIiBmaWxsPSIjMzM3NUJCIi8+PC9zdmc+',
      color: '#3375BB',
      isInstalled: typeof window !== 'undefined' && (!!window.ethereum?.isTrust || !!window.trustWallet),
      identifier: 'trust'
    },
    {
      name: 'Keplr',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjNTFCM0UxIi8+PHBhdGggZD0iTTIwIDEwTDEwIDIwTDIwIDMwTDMwIDIwTDIwIDEwWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
      color: '#51B3E1',
      isInstalled: typeof window !== 'undefined' && (!!window.keplr || !!window.getOfflineSigner),
      identifier: 'keplr'
    },
    {
      name: 'OKX',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iYmxhY2siLz48cGF0aCBkPSJNMjAgMTBMMTAgMjBMMjAgMzBMMzAgMjBMMjAgMTBaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
      color: '#000000',
      isInstalled: typeof window !== 'undefined' && (!!window.okxwallet || !!window.okex),
      identifier: 'okx'
    },
    {
      name: 'Sui Wallet',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIHJ4PSI2NCIgZmlsbD0iIzZGQjNGRiIvPjxwYXRoIGQ9Ik00Mi42NjY3IDQyLjY2NjdINTUuMzMzNFY4NS4zMzM0SDQyLjY2NjdWNDIuNjY2N1pNNzIuNjY2NyA0Mi42NjY3SDg1LjMzMzRWODUuMzMzNEg3Mi42NjY3VjQyLjY2NjdaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
      color: '#6FB3FF',
      isInstalled: typeof window !== 'undefined' && (!!window.sui || !!window.suiWallet),
      identifier: 'sui'
    }
  ].filter(w => w.identifier !== 'ton'); // Filter out TON wallet

  const getProviderInfo = () => {
    if (!window.ethereum) return null;

    // Better provider detection
    const providers = window.ethereum.providers || [window.ethereum];
    const metamaskProvider = providers.find(
      (p: any) => p.isMetaMask && !p.isCoinbaseWallet && !p.isBraveWallet && !p.isCore
    );
    const coreProvider = providers.find((p: any) => p.isCore || p.isCoreWallet);

    if (metamaskProvider || coreProvider) {
      return {
        provider: metamaskProvider || coreProvider,
        isCore: !!coreProvider
      };
    }
    return null;
  };

  const providerInfo = getProviderInfo();
  if (providerInfo) {
    const isCore = providerInfo.isCore;
    if (isCore) {
      wallets[0] = {
        ...wallets[0],
        name: 'Core Wallet',
        color: '#3375BB',
        identifier: 'core',
        isInstalled: true
      };
    } else {
      wallets[0].isInstalled = true;
    }
  }

  // Check connection status for each wallet
  const checkConnectionStatus = async () => {
    for (let wallet of wallets) {
      try {
        switch (wallet.identifier) {
          case 'metamask':
            if (window.ethereum?.selectedAddress) {
              wallet.isConnected = true;
            }
            break;
          case 'phantom':
            const phantomProvider = window.phantom?.solana || window.solana;
            if (phantomProvider?.isConnected) {
              wallet.isConnected = true;
            }
            break;
          case 'coinbase':
            if (window.ethereum?.isCoinbaseWallet && window.ethereum?.selectedAddress) {
              wallet.isConnected = true;
            }
            break;
          // Add other wallet checks
        }
      } catch (error) {
        console.error(`Error checking ${wallet.name} connection:`, error);
      }
    }
  };

  await checkConnectionStatus();
  return wallets;
};
