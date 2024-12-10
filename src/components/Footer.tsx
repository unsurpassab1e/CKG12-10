import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <a href="mailto:ckgtournaments@gmail.com">ckgtournaments@gmail.com</a>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>Bucyrus, Ohio 44820</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/tournaments" className="hover:text-blue-400">Tournaments</Link></li>
              <li><Link to="/results" className="hover:text-blue-400">Results</Link></li>
              <li><Link to="/sponsors" className="hover:text-blue-400">Sponsors</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <div className="text-sm text-gray-400">
              <p className="mb-4">
                © {currentYear} CKG Tournaments. All rights reserved. The content, design, graphics, and all other materials on this site are protected by copyright and other intellectual property laws.
              </p>
              <p className="mb-4">
                Any unauthorized use, reproduction, modification, distribution, transmission, republication, display, or performance of the content on this site is strictly prohibited.
              </p>
              <p>
                All tournament features, registration systems, and management tools are proprietary to CKG Tournaments and may not be copied or replicated without express written permission.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>
            This website and its features are protected by U.S. and international copyright laws. Violators will be prosecuted to the fullest extent of the law.
          </p>
        </div>
      </div>
    </footer>
  );
}