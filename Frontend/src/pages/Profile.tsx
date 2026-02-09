import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Moon, DollarSign, FileText, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* User Identity Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Rahul Sharma</h2>
            <p className="text-sm text-gray-500">rahul.sharma@email.com</p>
            <p className="text-xs text-gray-400 mt-1">ID: INV-2024-8472</p>
          </div>
        </div>

        {/* Financial Context Section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Investment Profile</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Risk Profile</span>
              <span className="text-sm font-medium text-gray-900 bg-blue-50 px-3 py-1 rounded-full">
                Moderate
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Experience Level</span>
              <span className="text-sm font-medium text-gray-900">Intermediate</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Preferred Markets</span>
              <span className="text-sm font-medium text-gray-900">Stocks, ETFs</span>
            </div>
          </div>
        </div>

        {/* Preferences & Settings */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Preferences</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-900">Notifications</span>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-11 h-6 rounded-full transition-colors ${
                  notificationsEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-900">Theme</span>
              </div>
              <span className="text-sm text-gray-500">Light</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-900">Currency</span>
              </div>
              <span className="text-sm text-gray-500">INR (₹)</span>
            </div>
          </div>
        </div>

        {/* App & Account Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-900">Terms & Privacy</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-900">Help & Support</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5 text-red-600" />
          <span className="text-sm font-medium text-red-600">
            {loggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>

        {/* App Version */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-400">Version 1.2.0</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
