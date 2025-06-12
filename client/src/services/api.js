import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach token automatically if present
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Campaigns
export const getAllCampaigns = async () => {
  const res = await API.get('/campaigns');
  return res.data;
};

export const getCampaignById = async (id) => {
  const res = await API.get(`/campaigns/${id}`);
  return res.data;
};

export const createCampaign = async (data) => {
  const res = await API.post('/campaigns', data);
  return res.data;
};

// Update campaign — only allowed fields, using multipart/form-data for potential file (qrCode)
export const updateCampaign = async (id, formData) => {
  const res = await API.patch(`/campaigns/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// Delete campaign by id
export const deleteCampaign = async (id) => {
  const res = await API.delete(`/campaigns/${id}`);
  return res.data;
};

// Payments
export const submitPayment = async (formData) => {
  const res = await API.post('/payments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getPendingPayments = async () => {
  const res = await API.get('/payments/pending');
  return res.data;
};

export const verifyPayment = async (paymentId) => {
  const res = await API.patch(`/payments/verify/${paymentId}`);
  return res.data;
};

export const rejectPayment = async (paymentId) => {
  const res = await API.patch(`/payments/reject/${paymentId}`);
  return res.data;
};
export const getMyPayments = async () => {
  const res = await API.get('/payments/my');
  return res.data;
};