export const createMediaBlobUrl = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error creating blob URL:', error);
    return url;
  }
};

export const revokeBlobUrl = (url: string) => {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

export const handleMediaError = (element: HTMLImageElement | HTMLVideoElement, type: 'image' | 'video') => {
  if (type === 'image') {
    (element as HTMLImageElement).src = '/placeholder-image.png';
  } else {
    (element as HTMLVideoElement).poster = '/video-error-placeholder.png';
  }
};
