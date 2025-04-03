import axios from 'axios';

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_API = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY;

export const ipfsStorage = {
  async saveProfile(data: any) {
    try {
      console.log('Preparing data for Pinata upload:', data);
      
      const response = await axios.post(PINATA_API, {
        pinataContent: data,
        pinataMetadata: {
          name: `profile_${data.walletAddress}`,
          keyvalues: {
            type: 'profile',
            address: data.walletAddress.toLowerCase()
          }
        }
      }, {
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Pinata upload successful:', response.data);
      return response.data.IpfsHash;
    } catch (error: any) {
      console.error('Detailed Pinata Error:', {
        message: error.message,
        response: error.response?.data
      });
      throw new Error('Failed to upload profile to IPFS');
    }
  },

  async getProfile(cid: string) {
    try {
      const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }
};
