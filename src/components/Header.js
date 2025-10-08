import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';
import AuthModal from './AuthModal';

function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, profile, signOut } = useAuth();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleSignOut = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    try {
      await signOut();
      setShowProfileMenu(false);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <div className="header">
        <h1>Hilites</h1>
        
        <div className="header-actions">
          {user ? (
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    {getInitials(profile?.full_name || user.email)}
                  </div>
                )}
              </button>

              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <p className="profile-name">{profile?.full_name || 'User'}</p>
                    <p className="profile-email">{user.email}</p>
                  </div>
                  <div className="profile-dropdown-divider" />
                  <button className="profile-dropdown-item">
                    <span>👤</span> Profile
                  </button>
                  <button className="profile-dropdown-item">
                    <span>⚙️</span> Settings
                  </button>
                  <button className="profile-dropdown-item">
                    <span>👥</span> Friends
                  </button>
                  <div className="profile-dropdown-divider" />
                  <button className="profile-dropdown-item signout" onClick={handleSignOut}>
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="sign-in-btn" onClick={() => setShowAuthModal(true)}>
              Sign In
            </button>
          )}
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

export default Header;