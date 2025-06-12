import express from 'express';
import {
  submitPayment,
  getPendingPayments,
  verifyPayment,
  getUnverifiedPaymentCount,
  rejectPayment,
  getMyPaymentsWithReceipts, // <-- Import the new controller
} from '../controllers/paymentController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import uploadMiddleware from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Upload payment screenshot route
router.post('/', authMiddleware, uploadMiddleware.single('screenshot'), submitPayment);

// Routes requiring admin access
router.get('/pending', authMiddleware, adminMiddleware, getPendingPayments);
router.patch('/verify/:paymentId', authMiddleware, adminMiddleware, verifyPayment);

// Any authenticated user can get unverified payment count
router.get('/unverified/count', authMiddleware, getUnverifiedPaymentCount);
router.patch('/reject/:paymentId', authMiddleware, adminMiddleware, rejectPayment);

// NEW: Get verified payments with receipts for the logged-in user
router.get('/my', authMiddleware, getMyPaymentsWithReceipts);

export default router;
