import React from 'react';
import { motion } from 'framer-motion';
import { getUserProfile } from '../utils/storage';

const ProfilePage = () => {
  const userProfile = getUserProfile();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-black/50 backdrop-blur-xl rounded-xl p-8 border border-white/10"
      >
        <h1 className="text-3xl font-bold text-white mb-8">Profile Details</h1>
        <div className="space-y-6">
          {userProfile ? (
            <>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                {userProfile.avatar && (
                  <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 shadow-xl">
                    <img 
                      src={userProfile.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-grow text-center md:text-left">
                  <h2 className="text-2xl font-semibold text-white">{userProfile.username}</h2>
                  <p className="text-gray-400 mt-2">{userProfile.profession}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.interests?.map((interest, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-400">No profile data available</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
