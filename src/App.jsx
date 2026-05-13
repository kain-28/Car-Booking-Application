import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import Home from './pages/Home'
import Listings from './pages/Listings'
import CarDetail from './pages/CarDetail'
import SellCar from './pages/SellCar'
import TestDrive from './pages/TestDrive'
import Compare from './pages/Compare'
import Dashboard from './pages/Dashboard'

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rk_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('rk_user', JSON.stringify(userData));
    localStorage.setItem('rk_token', token);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rk_user');
    localStorage.removeItem('rk_token');
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} onOpenAuth={openAuth} />
      <main>
        <Routes>
          <Route path="/" element={<Home onOpenAuth={openAuth} />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/car/:id" element={<CarDetail user={user} onOpenAuth={openAuth} />} />
          <Route path="/sell" element={<SellCar user={user} onOpenAuth={openAuth} />} />
          <Route path="/test-drive" element={<TestDrive user={user} onOpenAuth={openAuth} />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
        </Routes>
      </main>
      <Footer />
      {showAuth && (
        <AuthModal
          key={authMode}
          mode={authMode}
          onSwitch={(m) => setAuthMode(m)}
          onClose={() => setShowAuth(false)}
          onSuccess={handleLogin}
        />
      )}
    </>
  )
}

export default App
