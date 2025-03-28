import React from 'react';
import { motion } from 'framer-motion';

export const Features = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Seamless Integration',
              description: 'Connect with multiple wallets effortlessly'
            },
            {
              title: 'Enhanced Security',
              description: 'Your data, your control, always protected'
            },
            {
              title: 'Community First',
              description: 'Built for and by the community'
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
