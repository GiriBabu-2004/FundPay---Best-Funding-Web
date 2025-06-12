import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload, FiCreditCard } from 'react-icons/fi';

const PaymentModal = ({ isOpen, onClose, campaign }) => {
  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    if (!amount || !screenshot) {
      setFeedback('Please enter amount and upload a screenshot.');
      return;
    }

    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('screenshot', screenshot);
    formData.append('campaignId', campaign._id);

    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setFeedback('✅ Payment submitted for verification!');
        setTimeout(() => {
          onClose();
          setAmount('');
          setScreenshot(null);
          setFeedback('');
        }, 1500);
      } else {
        setFeedback('❌ Failed to submit payment.');
      }
    } catch (error) {
      console.error(error);
      setFeedback('❌ An error occurred during payment submission.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl relative"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
              aria-label="Close modal"
              disabled={submitting}
            >
              <FiX size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4 text-center text-indigo-700">
              Donate to: {campaign?.title || 'Campaign'}
            </h2>

            {campaign?.upi && (
              <p className="mb-1 text-center text-sm font-mono">UPI: {campaign.upi}</p>
            )}

            {campaign?.bank && (
              <p className="mb-4 text-center text-sm text-gray-600">
                Bank: {campaign.bank}
              </p>
            )}

            <label className="block mb-3">
              <span className="text-sm text-gray-700 flex items-center gap-2">
                <FiCreditCard /> Enter amount
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={submitting}
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm text-gray-700 flex items-center gap-2">
                <FiUpload /> Upload payment screenshot
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files[0])}
                className="mt-1"
                disabled={submitting}
              />
            </label>

            {feedback && (
              <p className="text-sm text-center mb-4 text-red-600">{feedback}</p>
            )}

            <div className="flex justify-between mt-2">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
