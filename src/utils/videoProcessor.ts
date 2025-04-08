export const processVideoFile = async (file: File): Promise<{ url: string; thumbnail?: string }> => {
  const videoUrl = URL.createObjectURL(file);
  
  // Create video thumbnail
  const thumbnail = await createVideoThumbnail(file);
  
  return {
    url: videoUrl,
    thumbnail
  };
};

const createVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      video.currentTime = 1; // Seek to 1 second
    };
    video.oncanplay = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
      URL.revokeObjectURL(video.src);
    };
    video.src = URL.createObjectURL(file);
  });
};
