import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} from '../services/api.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import PaymentModal from '../components/PaymentModal';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiSave, FiXCircle, FiCheckCircle } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    targetAmount: '',
    upi: '',
    bank: '',
  });

  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Get logged-in userId from localStorage user object
  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser)?.id : null;

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoadingCampaign(true);
        setFetchError(null);
        const data = await getCampaignById(id);
        setCampaign(data);
      } catch (error) {
        setFetchError('Failed to load campaign details.');
        console.error('Error fetching campaign:', error);
      } finally {
        setLoadingCampaign(false);
      }
    };
    fetch();
  }, [id]);

  useEffect(() => {
    if (campaign) {
      setUpdatedData({
        targetAmount: campaign.targetAmount || '',
        upi: campaign.upi || '',
        bank: campaign.bank || '',
      });
    }
  }, [campaign]);

  const isCreator = campaign?.createdBy?.toString() === userId;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    if (!updatedData.targetAmount || updatedData.targetAmount <= 0) {
      alert('Please enter a valid target amount.');
      return;
    }

    setUpdateLoading(true);
    try {
      await updateCampaign(campaign._id, updatedData);
      alert('Campaign updated successfully');
      setEditMode(false);
      const updated = await getCampaignById(campaign._id);
      setCampaign(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to update campaign');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    setDeleteLoading(true);
    try {
      await deleteCampaign(campaign._id);
      alert('Campaign deleted successfully');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to delete campaign');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loadingCampaign)
    return (
      <motion.div
        className="flex justify-center items-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-lg font-medium text-gray-700">Loading campaign details...</p>
      </motion.div>
    );

  if (fetchError)
    return (
      <motion.div
        className="flex flex-col justify-center items-center min-h-screen text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-red-600 text-lg mb-4">{fetchError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          aria-label="Retry loading campaign"
        >
          Retry
        </button>
      </motion.div>
    );

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 space-y-8"
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Title */}
      <h1 className="text-5xl font-extrabold text-gray-900 flex items-center gap-3">
        {campaign.title} <MdVerified className="text-indigo-600" size={36} title="Verified Campaign" />
      </h1>

      {/* Thumbnail */}
      {campaign.thumbnail && (
        <motion.img
          src={campaign.thumbnail}
          alt={campaign.title}
          className="rounded-lg shadow-lg w-full max-h-72 object-cover mx-auto"
          loading="lazy"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Description */}
      <p className="text-gray-700 leading-relaxed text-lg">{campaign.description}</p>

      {/* Payment Info */}
      <motion.div
        className="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Information</h2>

        {campaign.qrCode && (
          <div className="mb-6 flex flex-col items-center">
            <strong className="mb-2 text-gray-700 text-lg">QR Code:</strong>
            <img
              src={campaign.qrCode}
              alt="QR Code"
              className="w-40 h-40 object-contain rounded-md border border-gray-300"
              loading="lazy"
            />
          </div>
        )}

        {campaign.upi && (
          <p className="text-gray-700 mb-2 text-lg">
            <span className="font-semibold">UPI:</span> {campaign.upi}
          </p>
        )}
        {campaign.bank && (
          <p className="text-gray-700 mb-2 text-lg">
            <span className="font-semibold">Bank:</span> {campaign.bank}
          </p>
        )}

        <p className="mt-4 font-semibold text-red-600 text-center text-sm sm:text-base">
          !! Please click on <em>Verify Now</em> button below to verify your payment !!
        </p>
      </motion.div>

      {/* Progress */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 rounded-md p-4 shadow-inner border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="text-lg text-gray-800 font-semibold">
          Target: <span className="text-indigo-700">{formatCurrency(campaign.targetAmount)}</span>
        </div>
        <div className="text-lg text-gray-800 font-semibold mt-2 sm:mt-0">
          Collected: <span className="text-green-600">{formatCurrency(campaign.collectedAmount)}</span>
        </div>
      </motion.div>

      {/* Verify Now Button */}
      <div className="text-center">
        <motion.button
          onClick={() => setOpenModal(true)}
          className="inline-flex items-center justify-center gap-2 px-10 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          aria-label="Open payment verification modal"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MdVerified size={24} /> Verify Now
        </motion.button>
      </div>

      {/* Creator Controls */}
      {isCreator && (
        <motion.div
          className="mt-8 border-t pt-6 border-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {!editMode ? (
            <div className="flex justify-center space-x-6">
              <motion.button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow hover:bg-yellow-600 transition focus:outline-none focus:ring-2 focus:ring-yellow-400"
                aria-label="Edit campaign"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiEdit2 size={20} /> Edit
              </motion.button>
              <motion.button
                onClick={handleDelete}
                disabled={deleteLoading}
                className={`flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-400 ${
                  deleteLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label="Delete campaign"
                whileHover={{ scale: deleteLoading ? 1 : 1.05 }}
                whileTap={{ scale: deleteLoading ? 1 : 0.95 }}
              >
                <FiTrash2 size={20} />
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </motion.button>
            </div>
          ) : (
            <motion.div className="max-w-md mx-auto space-y-4" initial="initial" animate="animate" exit="exit" variants={fadeIn}>
              <label className="block">
                <span className="text-gray-700 font-semibold">Target Amount</span>
                <input
                  type="number"
                  name="targetAmount"
                  value={updatedData.targetAmount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Target Amount"
                  min={1}
                  aria-label="Target Amount"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-semibold">UPI ID</span>
                <input
                  type="text"
                  name="upi"
                  value={updatedData.upi}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="UPI ID"
                  aria-label="UPI ID"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-semibold">Bank Details</span>
                <input
                  type="text"
                  name="bank"
                  value={updatedData.bank}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Bank Details"
                  aria-label="Bank Details"
                />
              </label>

              <div className="flex justify-center space-x-4">
                <motion.button
                  onClick={handleEditSubmit}
                  disabled={updateLoading}
                  className={`flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-400 ${
                    updateLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  aria-label="Save campaign changes"
                  whileHover={{ scale: updateLoading ? 1 : 1.05 }}
                  whileTap={{ scale: updateLoading ? 1 : 0.95 }}
                >
                  <FiSave size={20} />
                  {updateLoading ? 'Saving...' : 'Save'}
                </motion.button>
                <motion.button
                  onClick={() => setEditMode(false)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
                  aria-label="Cancel editing campaign"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiXCircle size={20} /> Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Payment Modal */}
      <AnimatePresence>
        {openModal && (
          <PaymentModal
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            campaign={campaign}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CampaignDetail;
