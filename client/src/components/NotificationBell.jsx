import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBell = forwardRef((props, ref) => {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const fetchUnverifiedPaymentsCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        'http://localhost:5000/api/payments/unverified/count',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch notification count', error);
    }
  };

  useEffect(() => {
    fetchUnverifiedPaymentsCount();
  }, []);

  // Expose refresh to parent components
  useImperativeHandle(ref, () => ({
    refreshCount: fetchUnverifiedPaymentsCount,
  }));

  const handleClick = () => {
    navigate('/verify-payments');
  };

  return (
    <div
      className="relative cursor-pointer"
      onClick={handleClick}
      aria-label="View pending payment verifications"
      title="View pending payment verifications"
    >
      <FiBell className="text-2xl text-gray-600 hover:text-indigo-600 transition duration-200" />

      <AnimatePresence>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5 shadow"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
});

export default NotificationBell;
