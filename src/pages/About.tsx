import React from 'react';
import { Shield, Users, Trophy, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Organizing premier baseball and softball tournaments since 2024, bringing communities together through sports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <img
            src="https://images.unsplash.com/photo-1544975414-c0e7ac276faa?auto=format&fit=crop&q=80"
            alt="Tournament Action"
            className="rounded-lg shadow-lg w-full h-[400px] object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Teams Annually</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Tournaments</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
              <div className="text-gray-600">States</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">15k+</div>
              <div className="text-gray-600">Players</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Quality</h3>
          <p className="text-gray-600">
            Premium facilities and professional organization for every tournament.
          </p>
        </div>
        <div className="text-center">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Community</h3>
          <p className="text-gray-600">
            Building lasting relationships within the baseball and softball community.
          </p>
        </div>
        <div className="text-center">
          <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Competition</h3>
          <p className="text-gray-600">
            Fostering healthy competition and athletic excellence.
          </p>
        </div>
        <div className="text-center">
          <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Development</h3>
          <p className="text-gray-600">
            Supporting player growth and skill development at all levels.
          </p>
        </div>
      </div>
    </div>
  );
}