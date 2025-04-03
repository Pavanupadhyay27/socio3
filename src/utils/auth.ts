export const authenticateUser = async (address: string) => {
  // 1. Generate nonce
  const nonce = Math.floor(Math.random() * 1000000).toString();
  
  // 2. Ask user to sign message
  const message = `Welcome to Hashdit!\nPlease sign this message to verify your wallet ownership.\n\nNonce: ${nonce}`;
  
  // 3. Get signature using MetaMask
  const signature = await window.ethereum.request({
    method: 'personal_sign',
    params: [message, address]
  });

  return { signature, nonce };
};
