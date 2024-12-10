import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

export default function Hero() {
  const { isAuthenticated } = useAuth();

  const handleRegisterClick = () => {
    // Trigger the custom event to open signup modal
    const event = new CustomEvent('openSignupModal');
    window.dispatchEvent(event);
  };

  return (
    <div className="relative h-[500px]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&q=80"
          alt="Baseball field"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Premier Baseball & Softball Tournaments
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Join the most competitive tournaments in the region. Build memories, showcase talent, and compete with the best.
          </p>
          <div className="space-x-4">
            <Link
              to="/tournaments"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Find Tournaments
            </Link>
            <button 
              onClick={handleRegisterClick}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Register Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}