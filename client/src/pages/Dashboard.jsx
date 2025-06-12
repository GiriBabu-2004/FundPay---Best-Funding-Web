import React, { useEffect, useState } from 'react';
import CampaignCard from '../components/CampaignCard';
import Navbar from '../components/Navbar';
import { getAllCampaigns } from '../services/api.js';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      when: "beforeChildren"
    }
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
};

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllCampaigns();
        setCampaigns(res);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        setError('Failed to load campaigns. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <motion.main
        className="max-w-screen mx-auto p-8 min-h-screen bg-gradient-to-br from-blue-100 to-blue-300"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.8 } },
        }}
      >
        <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-900">
          Available Campaigns
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading campaigns...</p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : campaigns.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No campaigns available yet.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {campaigns.map(c => (
              <motion.div key={c._id} variants={cardVariants}>
                <CampaignCard campaign={c} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.main>
    </>
  );
};

export default Dashboard;
