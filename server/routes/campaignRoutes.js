import express from 'express';
import { createCampaign, getAllCampaigns, getCampaignById ,updateCampaign, deleteCampaign} from '../controllers/campaignController.js';
import { adminMiddleware, authMiddleware } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'; // ← add this

const router = express.Router();

router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);

// Only admin can add campaigns — with image uploads
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'qrCode', maxCount: 1 }
  ]),
  createCampaign
);

router.patch('/:id', authMiddleware, adminMiddleware, upload.fields([
  { name: 'qrCode', maxCount: 1 }
]), updateCampaign);

router.delete('/:id', authMiddleware, adminMiddleware, deleteCampaign);

export default router;
