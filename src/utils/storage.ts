import { ipfsStorage } from '../services/ipfsStorage';

export interface UserProfile {
  username: string;
  avatar?: string;
  walletAddress: string;
  bio?: string;
  profession: string;
  interests: string[];
  socialLinks: Record<string, string>;
}

export const getUserProfile = (address?: string): UserProfile | null => {
  try {
    // If no address provided, try to get last used profile
    if (!address) {
      // Try to get profile from last connected account
      const lastAccount = localStorage.getItem('lastConnectedAccount');
      
      // Try all possible storage keys
      const allProfiles = Object.keys(localStorage)
        .filter(key => key.startsWith('userProfile_'))
        .map(key => {
          try {
            return JSON.parse(localStorage.getItem(key) || '');
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      if (allProfiles.length > 0) {
        // Return the most recently updated profile
        return allProfiles.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0];
      }

      // Fallback to generic userProfile
      const genericProfile = localStorage.getItem('userProfile');
      if (genericProfile) return JSON.parse(genericProfile);

      return null;
    }
    
    // If address provided, try to get specific profile
    const profile = localStorage.getItem(`userProfile_${address.toLowerCase()}`);
    if (profile) return JSON.parse(profile);

    return null;
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
