import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, User, Bell, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const handleOpenSignupModal = () => {
      setIsSignupModalOpen(true);
    };

    window.addEventListener('openSignupModal', handleOpenSignupModal);
    return () => {
      window.removeEventListener('openSignupModal', handleOpenSignupModal);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const openAuthModal = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-blue-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <img 
                  src="https://i.ibb.co/478t8SS/CKG-Logo.png" 
                  alt="CKG Tournaments Logo" 
                  className="h-12 w-auto"
                />
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">Home</Link>
                <Link to="/tournaments" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">Tournaments</Link>
                <Link to="/results" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">Results</Link>
                <Link to="/pickup-player" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">Pick Up Player</Link>
                <Link to="/sponsors" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">Sponsors</Link>
                <Link to="/smash-it-rep" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">Smash It Rep</Link>
                <Link to="/announcements" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md flex items-center">
                  <Bell className="w-4 h-4 mr-1" />
                  Announcements
                </Link>
                <Link to="/contact" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">Contact</Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md transition-colors"
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Admin
                  </Link>
                )}
              </div>
            </div>
            
            <div className="hidden md:block">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white">Welcome, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  Account
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-gray-200"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link to="/" className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md">Home</Link>
                <Link to="/tournaments" className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md">Tournaments</Link>
                <Link to="/results" className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md">Results</Link>
                <Link to="/pickup-player" className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md">Pick Up Player</Link>
                <Link to="/sponsors" className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md">Sponsors</Link>
                <Link to="/smash-it-rep" className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md">Smash It Rep</Link>
                <Link to="/announcements" className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md flex items-center">
                  <Bell className="w-4 h-4 mr-1" />
                  Announcements
                </Link>
                <Link to="/contact" className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md">Contact</Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md transition-colors"
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Admin
                  </Link>
                )}
                
                {isAuthenticated ? (
                  <div className="pt-4 border-t border-blue-700">
                    <div className="flex items-center px-3 py-2 text-white">
                      <User className="w-5 h-5 mr-2" />
                      <span>{user?.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full mt-2 flex items-center justify-center px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-blue-700">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        openAuthModal();
                      }}
                      className="w-full flex items-center justify-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
}