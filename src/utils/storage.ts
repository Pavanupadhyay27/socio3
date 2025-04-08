import { ipfsStorage } from '../services/ipfsStorage';

export interface UserProfile {
  username: string;
  avatar?: string;
  walletAddress: string;
  bio?: string;
  profession: string;
  interests: string[];
  socialLinks: Record<string, string>;
  ipfsCid?: string;
  lastUpdated?: string;
}

export const getUserProfile = (address?: string): UserProfile | null => {
  try {
    if (address) {
      // Try to get profile specific to address
      const profile = localStorage.getItem(`profile_${address.toLowerCase()}`);
      if (profile) return JSON.parse(profile);
    }
    
    // Fallback to general profile
    const profile = localStorage.getItem('userProfile');
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const setUserProfile = (data: UserProfile, address: string): void => {
  try {
    // Save with address-specific key
    const profileKey = `userProfile_${address.toLowerCase()}`;
    const profileData = {
      ...data,
      walletAddress: address.toLowerCase(),
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(profileKey, JSON.stringify(profileData));
    localStorage.setItem('lastConnectedAccount', address);
    
    // Also save as current profile
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    // Dispatch event for UI updates
    const event = new CustomEvent('profileUpdated', { detail: profileData });
    window.dispatchEvent(event);
  } catch (error) {
    console.error('Error setting user profile:', error);
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
