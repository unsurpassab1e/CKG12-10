import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { useStore } from './lib/store';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import TournamentManagement from './pages/TournamentManagement';
import Results from './pages/Results';
import Sponsors from './pages/Sponsors';
import PickUpPlayer from './pages/PickUpPlayer';
import SmashItRep from './pages/SmashItRep';
import Contact from './pages/Contact';
import Announcements from './pages/Announcements';
import AdminDashboard from './pages/AdminDashboard';
import AnnouncementsManagement from './pages/AnnouncementsManagement';
import FirebaseStatus from './components/FirebaseStatus';

function App() {
  const initialize = useStore(state => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tournaments" element={<Tournaments />}>
                <Route path="manage" element={<TournamentManagement />} />
              </Route>
              <Route path="/results" element={<Results />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/pickup-player" element={<PickUpPlayer />} />
              <Route path="/smash-it-rep" element={<SmashItRep />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/announcements" element={<AnnouncementsManagement />} />
            </Routes>
          </main>
          <Footer />
          {import.meta.env.DEV && <FirebaseStatus />}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;