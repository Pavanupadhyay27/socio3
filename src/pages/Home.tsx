import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, TrendingUp as Trending, Award, Shield, Sparkles } from 'lucide-react';

const Home = () => {
  // Feature data that will be used twice
  const features = [
    {
      icon: MessageCircle,
      title: "Engaging Discussions",
      description: "Participate in meaningful conversations with a global community",
      color: "#818CF8",
      gradient: "from-indigo-500/20 to-indigo-500/5"
    },
    {
      icon: Users,
      title: "Vibrant Communities",
      description: "Join or create communities around your interests",
      color: "#F472B6",
      gradient: "from-pink-500/20 to-pink-500/5"
    },
    {
      icon: Trending,
      title: "Trending Topics",
      description: "Stay updated with what's hot and happening",
      color: "#34D399",
      gradient: "from-emerald-500/20 to-emerald-500/5"
    },
    {
      icon: Award,
      title: "Rewards System",
      description: "Earn rewards for quality contributions",
      color: "#FBBF24",
      gradient: "from-amber-500/20 to-amber-500/5"
    },
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Your privacy and security are our top priority",
      color: "#60A5FA",
      gradient: "from-blue-500/20 to-blue-500/5"
    },
    {
      icon: Sparkles,
      title: "Rich Features",
      description: "Experience next-generation social features",
      color: "#A78BFA",
      gradient: "from-purple-500/20 to-purple-500/5"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-start pt-32"
    >
      <div className="container mx-auto px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-purple-500/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-pink-500/20 rounded-full blur-[120px]" />
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="space-y-24"> {/* Reduced spacing */}
            {/* Single Future Unleashed Section */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent 
                bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 
                [text-shadow:_0_4px_20px_rgb(168_85_247_/_20%)] 
                will-change-transform text-center tracking-tight"
            >
              Future Unleashed
            </motion.h2>

            {/* Single Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm border border-white/10"
                >
                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.gradient} mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                    <motion.div
                      className="mt-4 flex items-center gap-2 text-purple-400 group-hover:text-purple-300"
                      whileHover={{ x: 5 }}
                    >
                      Learn more
                      <span>→</span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;