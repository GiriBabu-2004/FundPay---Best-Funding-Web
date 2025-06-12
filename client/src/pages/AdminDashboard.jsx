import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllCampaigns } from '../services/api.js';
import Navbar from '../components/Navbar';
import CampaignCard from '../components/CampaignCard';
import Loader from '../components/Loader'; // Assuming you have this

const AdminDashboard = () => {
  const { isAdmin, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/'); // Redirect non-admins
    }
  }, [isAdmin, authLoading, navigate]);

  const fetchCampaigns = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await getAllCampaigns();
      setCampaigns(data);
    } catch (error) {
      setFetchError('Failed to fetch campaigns. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchCampaigns();
    }
  }, [isAdmin]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen" aria-live="polite">
        <p>Checking authorization...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-screen mx-auto p-6 min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <h2 className="text-3xl font-bold mb-6">Manage Campaigns</h2>

        {loading ? (
          <div aria-live="polite">
            <Loader />
          </div>
        ) : fetchError ? (
          <div className="text-center text-red-600" aria-live="polite">
            <p>{fetchError}</p>
            <button
              onClick={fetchCampaigns}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        ) : campaigns.length === 0 ? (
          <p>No campaigns found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
