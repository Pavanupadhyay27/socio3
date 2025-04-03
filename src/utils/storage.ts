import { ipfsStorage } from '../services/ipfsStorage';

export const getUserProfile = async (address: string) => {
  try {
    const cid = localStorage.getItem(`profile_cid_${address.toLowerCase()}`);
    if (!cid) return null;
    return await ipfsStorage.getProfile(cid);
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const setUserProfile = async (data: any, walletAddress: string) => {
  try {
    const profileData = {
      ...data,
      walletAddress: walletAddress.toLowerCase(),
      updatedAt: new Date().toISOString()
    };

    const cid = await ipfsStorage.saveProfile(profileData);
    if (!cid) throw new Error('Failed to get CID from IPFS');
    
    localStorage.setItem(`profile_cid_${walletAddress.toLowerCase()}`, cid);
    
    // Dispatch event after successful save
    window.dispatchEvent(new Event('profileUpdated'));
    
    return { cid, profile: profileData };
  } catch (error) {
    console.error('Profile storage error:', error);
    throw error;
  }
};

export const hasExistingProfile = async (address: string) => {
  try {
    const cid = localStorage.getItem(`profile_cid_${address.toLowerCase()}`);
    if (!cid) return false;
    
    const profile = await ipfsStorage.getProfile(cid);
    return !!profile;
  } catch (error) {
    console.error('Error checking existing profile:', error);
    return false;
  }
};
