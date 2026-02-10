import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Moon, DollarSign, FileText, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase';
import './HomePage.css';
import './profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (

    <>
      <div className="header">
        <div className="header-greeting">My Account</div>
        <h1 className="header-title">Profile</h1>
      </div>

      <div className="profile-section">
        {/* User Identity Section */}
        <div className="profile-card identity-card">
          <div className="profile-avatar-container">
            <div className="profile-avatar overflow-hidden">
              {user?.photoURL && !imgError ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <User size={40} color="white" />
              )}
            </div>
          </div>
          <h2 className="profile-name">{user?.displayName || "Investor"}</h2>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-id">ID: INV-{user?.uid ? user.uid.substring(0, 8).toUpperCase() : 'GUEST'}</p>
        </div>

        {/* Financial Context Section */}
        <div className="profile-card">
          <h3 className="card-title">Investment Profile</h3>
          <div className="profile-list">
            <div className="profile-list-item">
              <span className="item-label">Risk Profile</span>
              <span className="item-value badge">Moderate</span>
            </div>
            <div className="profile-list-item">
              <span className="item-label">Experience Level</span>
              <span className="item-value">Intermediate</span>
            </div>
            <div className="profile-list-item">
              <span className="item-label">Preferred Markets</span>
              <span className="item-value">Stocks, ETFs</span>
            </div>
          </div>
        </div>

        {/* Preferences & Settings */}
        <div className="profile-card">
          <h3 className="card-title">Preferences</h3>
          <div className="profile-list">
            <div className="profile-list-item">
              <div className="item-left">
                <Bell size={20} className="item-icon" />
                <span className="item-text">Notifications</span>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`toggle-switch ${notificationsEnabled ? 'active' : ''}`}
              >
                <div className="toggle-thumb" />
              </button>
            </div>

            <div className="profile-list-item">
              <div className="item-left">
                <Moon size={20} className="item-icon" />
                <span className="item-text">Theme</span>
              </div>
              <span className="item-value">Light</span>
            </div>

            <div className="profile-list-item">
              <div className="item-left">
                <DollarSign size={20} className="item-icon" />
                <span className="item-text">Currency</span>
              </div>
              <span className="item-value">INR (₹)</span>
            </div>
          </div>
        </div>

        {/* App & Account Actions */}
        <div className="profile-card no-padding">
          <button className="action-button border-bottom">
            <div className="item-left">
              <FileText size={20} className="item-icon" />
              <span className="item-text">Terms & Privacy</span>
            </div>
            <ChevronRight size={20} className="item-arrow" />
          </button>

          <button className="action-button">
            <div className="item-left">
              <HelpCircle size={20} className="item-icon" />
              <span className="item-text">Help & Support</span>
            </div>
            <ChevronRight size={20} className="item-arrow" />
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="logout-button"
        >
          <LogOut size={20} />
          <span>{loggingOut ? "Logging out..." : "Logout"}</span>
        </button>

        {/* App Version */}
        <div className="version-text">
          Version 1.2.0
        </div>
      </div>
    </>
  );

};

export default Profile;
