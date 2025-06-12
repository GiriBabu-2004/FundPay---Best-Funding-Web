import Payment from '../models/Payment.js';
import Campaign from '../models/Campaign.js';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
// SUBMIT PAYMENT
export const submitPayment = async (req, res) => {
  try {
    const { campaignId, amount } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Screenshot file is required' });
    }

    const screenshotUrl = `/uploads/${req.file.filename}`;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const payment = new Payment({
      campaign: campaignId,
      user: userId,
      amount,
      screenshotUrl,
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Payment failed', error: err.message });
  }
};

// ✅ UPDATED: GET PENDING PAYMENTS — FILTER BY CAMPAIGN OWNER
export const getPendingPayments = async (req, res) => {
  try {
    const adminId = req.user._id;

    // Find campaigns created by this admin
    const adminCampaigns = await Campaign.find({ createdBy: adminId }).select('_id');
    const campaignIds = adminCampaigns.map(c => c._id);

    const pending = await Payment.find({
      verified: false,
      rejected: false,
      campaign: { $in: campaignIds }
    }).populate('campaign').populate('user', 'name'); ;

    res.status(200).json(pending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};

// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const adminId = req.user._id;
    const adminName = req.user.name || 'Admin';

    // Fetch payment details with populated user and campaign (including campaign owner)
    const payment = await Payment.findById(paymentId)
      .populate('campaign', 'title createdBy')
      .populate('user', 'name');

    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Ensure admin is the creator of the campaign
    if (String(payment.campaign.createdBy) !== String(adminId)) {
      return res.status(403).json({ message: 'Unauthorized to verify this payment' });
    }

    payment.verified = true;

    // Create the receipts directory if it doesn't exist
    const receiptsDir = path.join('uploads', 'receipts');
    if (!fs.existsSync(receiptsDir)) fs.mkdirSync(receiptsDir, { recursive: true });

    const doc = new PDFDocument({ margin: 50 });
    const receiptFilename = `receipt-${payment._id}.pdf`;
    const receiptPath = path.join(receiptsDir, receiptFilename);
    const receiptStream = fs.createWriteStream(receiptPath);
    doc.pipe(receiptStream);

    // --- Header ---
    doc
      .fillColor('#1D4ED8') 
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('FundPay', { align: 'center' })
      .moveDown();

    // --- Title ---
    doc
      .fillColor('black')
      .fontSize(18)
      .text('Payment Receipt', { align: 'center', underline: true })
      .moveDown(2);

    // --- Box for Payment Details ---
    const boxX = 50;
    const boxY = doc.y;
    const boxWidth = 500;
    const boxHeight = 200;

    doc
      .rect(boxX, boxY, boxWidth, boxHeight)
      .stroke();

    const padding = 15;
    const labelX = boxX + padding;
    const valueX = labelX + 140;
    const rowGap = 25;
    let y = boxY + padding;

    const drawRow = (label, value) => {
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .text(label, labelX, y);
      doc
        .font('Helvetica')
        .fontSize(12)
        .text(value, valueX, y);
      y += rowGap;
    };

    drawRow('Campaign:', payment.campaign.title);
    drawRow('User ID:', payment.user._id.toString());
    drawRow('User Name:', payment.user.name || 'N/A');
    drawRow('Amount Paid:', `${payment.amount.toFixed(2)}`);
    drawRow('Date:', new Date(payment.createdAt).toLocaleString());
    drawRow('Verified By Admin ID:', adminId.toString());
    drawRow('Admin Name:', adminName);

    // --- Company Stamp (instead of signature) ---
const stampImgPath = path.join('public', 'images', 'Fundpay-stamp.png'); // <-- your stamp image
const stampImgExists = fs.existsSync(stampImgPath);

if (stampImgExists) {
  const stampWidth = 120;
  const stampHeight = 120;
  const centerX = (doc.page.width - stampWidth) / 2;
  const bottomY = doc.page.height - stampHeight - 100;

  doc.image(stampImgPath, centerX, bottomY, {
    width: stampWidth,
    height: stampHeight,
  });
} else {
  // Fallback text if image not found
  doc
    .fillColor('black')
    .fontSize(12)
    .text('Company Stamp Missing', { align: 'center', baseline: 'bottom' });
}
    doc.end();

    // Wait until the PDF file is fully written
    await new Promise(resolve => receiptStream.on('finish', resolve));

    // Save PDF path in DB
    payment.receiptUrl = `/uploads/receipts/${receiptFilename}`;
    await payment.save();

    // Update campaign collected amount
    await Campaign.findByIdAndUpdate(payment.campaign._id, {
      $inc: { collectedAmount: payment.amount },
    });

    res.status(200).json({
      message: 'Payment verified',
      receiptUrl: payment.receiptUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
};

// GET UNVERIFIED PAYMENT COUNT
export const getUnverifiedPaymentCount = async (req, res) => {
  try {
    const adminId = req.user._id;

    const adminCampaigns = await Campaign.find({ createdBy: adminId }).select('_id');
    const campaignIds = adminCampaigns.map(c => c._id);

    const count = await Payment.countDocuments({
      verified: false,
      rejected: false,
      campaign: { $in: campaignIds }
    });

    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch unverified payment count', error: err });
  }
};

// REJECT PAYMENT
export const rejectPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const adminId = req.user._id;

    const payment = await Payment.findById(paymentId).populate('campaign');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Ensure the logged-in admin is the creator of the campaign
    if (String(payment.campaign.createdBy) !== String(adminId)) {
      return res.status(403).json({ message: 'Unauthorized to reject this payment' });
    }

    payment.rejected = true;
    await payment.save();

    res.status(200).json({ message: 'Payment rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Rejection failed', error: err.message });
  }
};

// Get verified payments with receipts for current user
export const getMyPaymentsWithReceipts = async (req, res) => {
  try {
    const userId = req.user._id;
    const payments = await Payment.find({ user: userId, verified: true })
      .populate('campaign', 'title')
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user payments', error: err.message });
  }
};
