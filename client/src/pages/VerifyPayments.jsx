import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { getPendingPayments, verifyPayment, rejectPayment } from '../services/api.js';
import NotificationBell from '../components/NotificationBell';
import { formatCurrency } from '../utils/formatCurrency';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.03, boxShadow: '0px 10px 20px rgba(0,0,0,0.12)' },
};

const buttonVariants = {
  tap: { scale: 0.95 },
};

const VerifyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);
  const [rejecting, setRejecting] = useState(null);

  const notificationBellRef = useRef();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPendingPayments();
        setPayments(data);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const refreshNotifications = () => {
    if (notificationBellRef.current) {
      notificationBellRef.current.refreshCount();
    }
  };

  const handleVerify = async (paymentId) => {
    setVerifying(paymentId);
    try {
      await verifyPayment(paymentId);
      setPayments((prev) => prev.filter((p) => p._id !== paymentId));
      refreshNotifications();
    } catch (error) {
      alert('Verification failed. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setVerifying(null);
    }
  };

  const handleReject = async (paymentId) => {
    setRejecting(paymentId);
    try {
      await rejectPayment(paymentId);
      setPayments((prev) => prev.filter((p) => p._id !== paymentId));
      refreshNotifications();
    } catch (error) {
      alert('Rejection failed. Please try again.');
      console.error('Rejection error:', error);
    } finally {
      setRejecting(null);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading pending payments...</p>;
  if (payments.length === 0) return <p className="text-center mt-8">No pending payments to verify.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 ">
      <NotificationBell ref={notificationBellRef} />
      <h2 className="text-2xl font-semibold mb-6 text-center">Pending Payments</h2>
      <div className="grid gap-6">
        {payments.map((p) => {
          const imgUrl =
            p.screenshotUrl && p.screenshotUrl.startsWith('http')
              ? p.screenshotUrl
              : `http://localhost:5000${p.screenshotUrl?.trim()}`;

          return (
            <motion.div
              key={p._id}
              className="flex items-center p-4 border rounded shadow-sm space-x-6 bg-white"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ duration: 0.3 }}
            >
              <img
                src={imgUrl}
                alt={`Payment Screenshot for payment ID ${p._id}`}
                className="w-32 h-32 object-cover rounded transition-transform duration-300 ease-in-out hover:scale-[2.34]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-image.png';
                }}
              />
              <div className="flex-1">
                <p className="text-lg font-medium">Amount: {formatCurrency(p.amount)}</p>
                <p className="text-sm text-gray-500">Paid by: {p.user?.name || 'Unknown'}</p>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => handleVerify(p._id)}
                  disabled={verifying === p._id || rejecting === p._id}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-white transition-colors ${
                    verifying === p._id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  whileTap="tap"
                  variants={buttonVariants}
                  aria-label="Verify payment"
                >
                  {verifying === p._id ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle size={20} />
                      Verify
                    </>
                  )}
                </motion.button>
                <motion.button
                  onClick={() => handleReject(p._id)}
                  disabled={rejecting === p._id || verifying === p._id}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-white transition-colors ${
                    rejecting === p._id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                  whileTap="tap"
                  variants={buttonVariants}
                  aria-label="Reject payment"
                >
                  {rejecting === p._id ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <FiXCircle size={20} />
                      Reject
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VerifyPayments;
