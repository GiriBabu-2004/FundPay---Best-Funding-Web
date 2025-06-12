import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';

import Login from '../pages/Login';
import Signup from '../pages/SignUp.jsx';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import CampaignDetail from '../pages/CampaignDetail';
import AddCampaign from '../pages/AddCampaign';
import VerifyPayments from '../pages/VerifyPayments';
import PaymentReceipts from '../pages/PaymentReceipts.jsx';
import ContactPage from '../pages/ContactPage.jsx';  // Import Contact page

const AppRoutes = () => {
  const { user } = useAuthContext();
  const isAdmin = user?.role === 'admin';

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Optional: public Contact page before login */}
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={isAdmin ? <AdminDashboard /> : <Dashboard />} />
      <Route path="/campaign/:id" element={<CampaignDetail />} />
      {isAdmin && (
        <>
          <Route path="/add-campaign" element={<AddCampaign />} />
          <Route path="/verify-payments" element={<VerifyPayments />} />
        </>
      )}
      <Route path="/receipts" element={<PaymentReceipts />} />
      <Route path="/contact" element={<ContactPage />} />  {/* Contact route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
