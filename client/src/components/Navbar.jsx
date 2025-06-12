import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext as useAuth } from '../context/AuthContext.jsx';
import NotificationBell from './NotificationBell.jsx';
import { isAdmin } from '../utils/roleCheck.js';
import axios from 'axios';
import { FiSearch, FiLogOut, FiPlusCircle, FiMail } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdminUser = isAdmin(user);

  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get('/api/campaigns');
        setCampaigns(res.data);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCampaigns([]);
      return;
    }
    const filtered = campaigns.filter((c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCampaigns(filtered);
  }, [searchTerm, campaigns]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserInitials = () => {
    if (!user) return '?';
    if (user.name) {
      const names = user.name.split(' ');
      return (
        names[0][0].toUpperCase() +
        (names[1] ? names[1][0].toUpperCase() : '')
      );
    }
    return user.email?.[0].toUpperCase() || '?';
  };

  return (
    <nav className="bg-white shadow-lg px-6 py-4 flex flex-wrap items-center justify-between relative z-50">
      <Link
        to="/"
        className="text-3xl font-extrabold text-indigo-600 hover:text-indigo-700 transition-all duration-300"
        aria-label="CrowdFund Home"
      >
        FundPay
      </Link>

      {/* Search input */}
      <div className="relative w-full max-w-sm mx-4 flex-grow" ref={searchRef}>
        <div className="relative">
          <input
            type="search"
            placeholder="Search campaigns..."
            aria-label="Search campaigns"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>

        {/* Campaign dropdown */}
        <AnimatePresence>
          {showDropdown && filteredCampaigns.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-64 overflow-auto"
            >
              {filteredCampaigns.map((campaign) => (
                <li
                  key={campaign._id}
                  className="px-5 py-3 hover:bg-indigo-100 cursor-pointer text-sm font-medium text-gray-700 transition-colors"
                  onClick={() => {
                    navigate(`/campaign/${campaign._id}`);
                    setSearchTerm('');
                    setShowDropdown(false);
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate(`/campaign/${campaign._id}`);
                      setSearchTerm('');
                      setShowDropdown(false);
                    }
                  }}
                >
                  {campaign.title}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Right side: Links, Bell, Avatar */}
      <div className="flex items-center gap-5 flex-wrap">
        {isAdminUser && (
          <>
            <Link
              to="/add-campaign"
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition"
              title="Add Campaign"
            >
              <FiPlusCircle size={18} />
              Add Campaign
            </Link>
            <NotificationBell />
          </>
        )}

        <Link
          to="/contact"
          className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 font-medium text-sm transition"
          title="Contact"
        >
          <FiMail size={18} />
          Contact
        </Link>

        <Link
          to="/receipts"
          className="text-gray-600 hover:text-indigo-600 font-medium text-sm transition"
          title="Payment Receipts"
        >
          Payment Receipts
        </Link>

        {/* Avatar or initials */}
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500 shadow-sm"
          />
        ) : (
          <div
            className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700
                       font-semibold text-lg select-none border-2 border-indigo-400 shadow-inner"
            aria-label="User initials"
          >
            {getUserInitials()}
          </div>
        )}

        <button
          onClick={() => logout(navigate)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-md shadow-md
                     hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition"
          aria-label="Logout"
          title="Logout"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
