interface UserProfile {
  username: string;
  avatar?: string;
  walletAddress: string;
  bio?: string;
}

export function setUserProfile(profile: UserProfile, address: string): void {
  try {
    localStorage.setItem(`userProfile_${address}`, JSON.stringify({
      ...profile,
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error setting user profile:', error);
    throw error;
  }
}

export function getUserProfile(address?: string): UserProfile | null {
  try {
    if (!address) return null;
    const profile = localStorage.getItem(`userProfile_${address}`);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}
