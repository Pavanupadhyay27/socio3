import axios from 'axios';

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_API = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY;
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;

// Cache for profile data
const profileCache = new Map();

// Debug logging
console.log('PINATA CONFIG:', {
  jwt: PINATA_JWT ? 'Present' : 'Missing',
  apiKey: PINATA_API_KEY ? 'Present' : 'Missing',
  secret: PINATA_API_SECRET ? 'Present' : 'Missing',
  gateway: PINATA_GATEWAY
});

export const ipfsStorage = {
  async optimizeImage(base64Image: string): Promise<string> {
    if (!base64Image) return '';
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set max dimensions
        const maxWidth = 800;
        const maxHeight = 800;
        
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = base64Image;
    });
  },

  async saveProfile(data: any) {
    if (!PINATA_API_KEY || !PINATA_API_SECRET) {
      throw new Error('Pinata credentials not configured');
    }

    // Check cache first
    const cacheKey = `profile_${data.walletAddress}`;
    if (profileCache.has(cacheKey)) {
      return profileCache.get(cacheKey);
    }

    try {
      // Optimize avatar if present
      if (data.avatar) {
        data.avatar = await this.optimizeImage(data.avatar);
      }

      console.log('Preparing Pinata upload:', {
        contentLength: JSON.stringify(data).length,
        hasWalletAddress: !!data.walletAddress
      });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await axios.post(
        PINATA_API,
        {
          pinataContent: data,
          pinataMetadata: {
            name: `profile_${data.walletAddress}`,
            keyvalues: {
              type: 'profile',
              address: data.walletAddress?.toLowerCase(),
              timestamp: new Date().toISOString()
            }
          }
        },
        {
          headers: {
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_API_SECRET,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeout);

      console.log('Pinata upload successful:', response.data);

      // Cache the result
      if (response.data.IpfsHash) {
        profileCache.set(cacheKey, response.data.IpfsHash);
      }

      return response.data.IpfsHash;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Upload timed out. Please try again.');
      }
      console.error('Pinata upload failed:', error.response?.data || error.message);
      throw new Error(`Failed to upload to IPFS: ${error.response?.data?.message || error.message}`);
    }
  },

  async getProfile(cid: string) {
    try {
      const response = await fetch(`${PINATA_GATEWAY}${cid}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }
};
