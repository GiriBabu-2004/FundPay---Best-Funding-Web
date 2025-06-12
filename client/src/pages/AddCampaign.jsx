import React, { useState } from 'react';
import { createCampaign } from '../services/api.js';
import { motion } from 'framer-motion';
import { FaImage, FaRupeeSign, FaUniversity, FaQrcode } from 'react-icons/fa';

const AddCampaign = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    targetAmount: '',
    upi: '',
    bank: '',
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [qrFile, setQrFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (thumbnailFile) data.append('thumbnail', thumbnailFile);
      if (qrFile) data.append('qrCode', qrFile);

      await createCampaign(data);
      alert('✅ Campaign added successfully!');

      setForm({
        title: '',
        description: '',
        targetAmount: '',
        upi: '',
        bank: '',
      });
      setThumbnailFile(null);
      setQrFile(null);
      e.target.reset(); // Optional
    } catch (error) {
      console.error(error);
      alert('❌ Failed to add campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 ">
    <motion.form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow space-y-6 "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-2">Create New Campaign</h2>

      <div>
        <label className="block text-sm mb-1 font-medium text-gray-700">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Campaign Title"
          className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the purpose of this campaign"
          rows={4}
          className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className=" text-sm mb-1 font-medium text-gray-700 flex items-center gap-2">
            <FaImage /> Thumbnail Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setThumbnailFile(e.target.files[0])}
            className="w-full"
          />
        </div>

        <div>
          <label className=" text-sm mb-1 font-medium text-gray-700 flex items-center gap-2">
            <FaQrcode /> QR Code (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setQrFile(e.target.files[0])}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className=" text-sm mb-1 font-medium text-gray-700 flex items-center gap-2">
          <FaRupeeSign /> Target Amount
        </label>
        <input
          type="number"
          name="targetAmount"
          value={form.targetAmount}
          onChange={handleChange}
          required
          min={1}
          placeholder="5000"
          className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 font-medium text-gray-700">UPI ID</label>
        <input
          name="upi"
          value={form.upi}
          onChange={handleChange}
          placeholder="someone@upi"
          className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label className=" text-sm mb-1 font-medium text-gray-700 flex items-center gap-2">
          <FaUniversity /> Bank Details
        </label>
        <input
          name="bank"
          value={form.bank}
          onChange={handleChange}
          placeholder="IFSC, Account No., etc."
          className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="pt-4 text-center">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? 'Adding...' : 'Add Campaign'}
        </button>
      </div>
    </motion.form>
    </div>
  );
};

export default AddCampaign;
