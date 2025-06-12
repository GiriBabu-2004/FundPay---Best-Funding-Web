import React, { useEffect, useState } from 'react';
import { getMyPayments } from '../services/api.js';
import { motion } from 'framer-motion';
import { FiFileText, FiCalendar, FiDollarSign, FiExternalLink } from 'react-icons/fi';
import { FaCoins } from 'react-icons/fa';

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const PaymentReceipts = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const data = await getMyPayments();
        setPayments(data);
      } catch (err) {
        setError('Failed to load receipts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReceipts();
  }, []);

  if (loading)
    return (
      <div className="text-center text-gray-600 py-20">Loading receipts...</div>
    );
  if (error)
    return (
      <div className="text-center text-red-600 py-20">{error}</div>
    );
  if (payments.length === 0)
    return (
      <div className="text-center text-gray-600 py-20">
        You don't have any receipts yet.
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">My Payment Receipts</h2>
      <motion.ul
        className="space-y-5"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {payments.map((payment) => (
          <motion.li
            key={payment._id}
            variants={itemVariants}
            className="border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex items-center mb-2 text-gray-700 font-semibold">
              <FiFileText className="mr-2 text-indigo-600" size={20} />
              <span>Campaign:</span>
              <span className="ml-auto">{payment.campaign.title}</span>
            </div>
            <div className="flex items-center mb-2 text-gray-700 font-medium">
              <FaCoins className="mr-2 text-green-600" size={18} />
              <span>Amount Paid:</span>
              <span className="ml-auto">{payment.amount}</span>
            </div>
            <div className="flex items-center mb-2 text-gray-700 font-medium">
              <FiCalendar className="mr-2 text-gray-500" size={18} />
              <span>Date:</span>
              <span className="ml-auto">
                {new Date(payment.createdAt).toLocaleString()}
              </span>
            </div>
            {payment.receiptUrl ? (
              <a
                href={`http://localhost:5000${payment.receiptUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-3 text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                View Receipt PDF <FiExternalLink className="ml-1" />
              </a>
            ) : (
              <div className="text-gray-500 mt-3 italic">No receipt available</div>
            )}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default PaymentReceipts;
