import React, { useState } from 'react';
import { Shield, Award, Users, DollarSign, Mail, ExternalLink, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { useStore } from '../lib/store';
import SponsorForm from '../components/SponsorForm';

export default function Sponsors() {
  const { isAdmin } = useAuth();
  const { sponsors, deleteSponsor } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<any | null>(null);

  const handleEdit = (sponsor: any) => {
    setEditingSponsor(sponsor);
    setShowForm(true);
  };

  const handleDelete = async (sponsorId: string) => {
    if (window.confirm('Are you sure you want to delete this sponsor?')) {
      try {
        await deleteSponsor(sponsorId);
      } catch (error) {
        console.error('Error deleting sponsor:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-gray-900">Our Sponsors</h1>
          {isAdmin && (
            <button
              onClick={() => {
                setEditingSponsor(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Sponsor
            </button>
          )}
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're proud to partner with organizations that share our passion for youth sports and community development.
        </p>
      </div>

      {showForm && (
        <SponsorForm
          onClose={() => {
            setShowForm(false);
            setEditingSponsor(null);
          }}
          editingSponsor={editingSponsor}
        />
      )}

      {/* Current Sponsors */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Current Partners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={sponsor.logo} 
                  alt={sponsor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{sponsor.name}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {sponsor.tier}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{sponsor.description}</p>
                <div className="flex items-center justify-between">
                  <a 
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700"
                  >
                    Visit Website <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(sponsor)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(sponsor.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Become a Sponsor */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Become a Sponsor?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Shield className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Brand Visibility</h3>
            <p className="text-gray-600">
              Reach thousands of families and sports enthusiasts across multiple tournaments and events throughout the year.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Users className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Community Impact</h3>
            <p className="text-gray-600">
              Support youth sports development and make a positive impact in local communities.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Award className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Access</h3>
            <p className="text-gray-600">
              Enjoy exclusive benefits and networking opportunities at our premier tournaments.
            </p>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-blue-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Becoming a Sponsor?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join our growing family of sponsors and make a difference in youth sports. Contact us to discuss sponsorship opportunities that align with your organization's goals.
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="mailto:ckgtournaments@gmail.com"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="w-5 h-5 mr-2" />
            Contact Us
          </a>
          <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            Download Sponsor Pack
          </button>
        </div>
      </div>
    </div>
  );
}