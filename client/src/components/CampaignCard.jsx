import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency.js';
import { motion } from 'framer-motion';
import { FaBullseye, FaHandHoldingUsd } from 'react-icons/fa';

const CampaignCard = ({ campaign }) => {
  const isCompleted = campaign.collectedAmount >= campaign.targetAmount;
  const progressPercent = Math.min(
    (campaign.collectedAmount / campaign.targetAmount) * 100,
    100
  );

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Link
        to={`/campaign/${campaign._id}`}
        className="relative block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
      >
        {isCompleted && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full z-10">
            Completed
          </div>
        )}

        {campaign.thumbnail ? (
          <img
            src={campaign.thumbnail}
            alt={campaign.title}
            className={`w-full h-48 object-cover ${isCompleted ? 'opacity-70' : ''}`}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}

        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{campaign.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{campaign.shortDescription}</p>

          <div className="text-sm text-gray-700 mb-1 flex items-center gap-2">
            <FaBullseye className="text-gray-500" />
            <strong className="font-medium">Goal:</strong>{' '}
            {formatCurrency(campaign.targetAmount)}
          </div>

          <div className="text-sm text-gray-700 mb-3 flex items-center gap-2">
            <FaHandHoldingUsd className="text-gray-500" />
            <strong className="font-medium">Raised:</strong>{' '}
            {formatCurrency(campaign.collectedAmount)}
          </div>

          {/* Progress bar with animation */}
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-indigo-600 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CampaignCard;
