import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-4"
        >
          <Leaf className="h-16 w-16 text-primary-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">CropGuard</h2>
        <p className="text-gray-600">Loading your dashboard...</p>
        
        <div className="mt-6 flex justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 bg-primary-600 rounded-full mx-1"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-primary-600 rounded-full mx-1"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-primary-600 rounded-full mx-1"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Loading; 