import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullscreen = false, message = 'Loading...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col items-center justify-center ${
        fullscreen ? 'fixed inset-0 bg-white z-50' : 'py-10'
      }`}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-opacity-50 mb-4" />
      <p className="text-gray-700 font-medium">{message}</p>
    </motion.div>
  );
};

export default Loader;
