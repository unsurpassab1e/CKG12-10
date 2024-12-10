import React from 'react';
import { ShoppingBag, Award, Star, Facebook, Phone, Tag, ExternalLink } from 'lucide-react';

export default function SmashItRep() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet Your Smash It Sports Representative</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your trusted source for premium baseball and softball equipment
        </p>
      </div>

      {/* Rep Profile */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Donavan Harper</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Meet Donavan, our dedicated softball and baseball representative at CKG. Donavan has a deep passion for 
              the game and years of experience both on the field and off. In Donavan's free time, he enjoys playing 
              adult softball. Not only does he love sharing his knowledge of the game, but he also loves playing.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Donavan is here to provide exceptional support and expertise to athletes, teams, and coaches. Whether 
              you're looking for the latest equipment, training tips, or game strategies, Donavan brings an abundance 
              of knowledge and a commitment to helping you and your team excel.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://www.facebook.com/donavan.harper.3"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5 mr-2" />
                Connect on Facebook
              </a>
              <a 
                href="https://www.smashitsports.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop Now
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 p-8 bg-gray-50">
            <div className="aspect-square">
              <img
                src="https://i.ibb.co/NLdjNSs/donavan1.jpg"
                alt="Donavan Harper"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="aspect-square">
              <img
                src="https://i.ibb.co/jRcxT0V/donavan2.jpg"
                alt="Donavan Harper playing softball"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Special Offer */}
      <div className="bg-blue-50 rounded-xl p-8 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <Tag className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Exclusive Discount</h2>
          <p className="text-xl text-gray-600 mb-6">
            Get special discounts on baseball/softball gear using code:
          </p>
          <div className="bg-white rounded-lg p-4 mb-6 inline-block">
            <code className="text-2xl font-bold text-blue-600">SISDONAVAN</code>
          </div>
          <p className="text-gray-600">
            Use this code at{' '}
            <a 
              href="https://www.smashitsports.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              smashitsports.com
            </a>
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How Donavan Can Help You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ShoppingBag className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Equipment Selection</h3>
            <p className="text-gray-600">
              Get personalized recommendations for bats, gloves, and protective gear tailored to your playing style.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Star className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Expert Advice</h3>
            <p className="text-gray-600">
              Benefit from years of experience in both baseball and softball to improve your game.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Award className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Team Orders</h3>
            <p className="text-gray-600">
              Special pricing and support for team equipment orders and uniforms.
            </p>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Elevate Your Game?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with Donavan on Facebook to discuss your equipment needs and take advantage of exclusive CKG tournament discounts.
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="https://www.facebook.com/donavan.harper.3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Facebook className="w-5 h-5 mr-2" />
            Connect on Facebook
          </a>
          <a 
            href="https://www.smashitsports.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Visit Smash It Sports
          </a>
        </div>
      </div>
    </div>
  );
}