import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import TournamentCard from '../components/TournamentCard';
import { useStore } from '../lib/store';

export default function Home() {
  const { tournaments, registeredTeams } = useStore();

  // Get the first 3 tournaments for the featured section
  const featuredTournaments = tournaments.slice(0, 3);

  return (
    <>
      <Hero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Tournaments</h2>
          <p className="text-gray-600 max-w-2xl">
            Browse and register for upcoming tournaments. Whether you're looking for baseball or softball competitions, we've got you covered.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTournaments.map((tournament) => (
            <Link 
              key={tournament.id} 
              to="/tournaments"
              className="transition-transform hover:scale-[1.02]"
            >
              <TournamentCard 
                {...tournament}
                registeredTeams={registeredTeams[tournament.id]}
              />
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Tournaments?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Professional Organization</h3>
              <p className="text-gray-600">Expertly organized events with experienced umpires and staff.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Quality Facilities</h3>
              <p className="text-gray-600">Games played at top-tier venues with excellent amenities.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Great Competition</h3>
              <p className="text-gray-600">Compete against top teams from across the region.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}