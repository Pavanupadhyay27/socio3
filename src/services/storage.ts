export async function uploadToStorage(data: any): Promise<string> {
  try {
    const id = `profile-${Date.now()}`;
    localStorage.setItem(id, JSON.stringify(data));
    console.log('Storage successful:', id);
    return id;
  } catch (error) {
    console.error('Storage error:', error);
    throw error;
  }
}

export async function getFromStorage(address: string): Promise<any> {
  try {
    const cacheKey = `profile_cache_${address.toLowerCase()}`;
    const data = localStorage.getItem(cacheKey);
    if (!data) {
      return null;
    }
    const parsed = JSON.parse(data);
    return parsed.data || parsed; // Return either new format or legacy format
  } catch (error) {
    console.error('Storage retrieval error:', error);
    return null;
  }
}
