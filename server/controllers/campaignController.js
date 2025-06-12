import Campaign from '../models/Campaign.js';
const backendURL = process.env.BACKEND_URL || 'http://localhost:5000';
export const createCampaign = async (req, res) => {
  try {
    const { title, description, targetAmount , upi, bank} = req.body;

    const thumbnail = req.files?.thumbnail?.[0]?.filename
      ? `${backendURL}/uploads/${req.files.thumbnail[0].filename}`
      : null;

    const qrCode = req.files?.qrCode?.[0]?.filename
      ? `${backendURL}/uploads/${req.files.qrCode[0].filename}`
      : null;

    const newCampaign = new Campaign({
      title,
      description,
      targetAmount,
      thumbnail,
      qrCode,
      upi,
      bank,
      createdBy: req.user._id, // assuming you set user in auth middleware
    });

    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (err) {
    res.status(400).json({ message: 'Error creating campaign', error: err.message });
  }
};



export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching campaigns' });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    res.status(200).json(campaign);
  } catch (err) {
    res.status(404).json({ message: 'Campaign not found' });
  }
};


export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetAmount, upi, bank } = req.body;
    let qrCode;

    if (req.files?.qrCode?.[0]?.filename) {
      const backendURL = process.env.BACKEND_URL || 'http://localhost:5000';
      qrCode = `${backendURL}/uploads/${req.files.qrCode[0].filename}`;
    }

    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    // Check if the logged-in user is the creator
    if (campaign.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update allowed fields only
    if (targetAmount) campaign.targetAmount = targetAmount;
    if (upi) campaign.upi = upi;
    if (bank) campaign.bank = bank;
    if (qrCode) campaign.qrCode = qrCode;

    await campaign.save();
    res.status(200).json(campaign);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update campaign', error: err.message });
  }
};

// Delete campaign by id
export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    if (campaign.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Campaign.findByIdAndDelete(id);
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete campaign', error: err.message });
  }
};