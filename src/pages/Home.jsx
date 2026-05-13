import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiArrowRight, FiMapPin, FiCalendar, FiDroplet } from 'react-icons/fi'
import { IoSpeedometer } from 'react-icons/io5'
import API from '../api'

const BRAND_ICONS = {
  Suzuki: '🔷', Audi: '💎', BMW: '🏎️', Ford: '🛡️', Honda: '🌊', KIA: '🔥'
};

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/cars?featured=true').then(r => setFeatured(r.data.data)).catch(() => {});
    API.get('/cars/brands').then(r => setBrands(r.data.data)).catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">✨ India's #1 Pre-owned Car Platform</div>
          <h1>Find Your Perfect Pre-Owned Car</h1>
          <p>Ришаб Каин brings you verified, inspected second-hand cars from top brands — Suzuki, Audi, BMW, Ford, Honda & KIA.</p>
          <div className="search-box" style={{ maxWidth: 520, margin: '0 auto 24px' }}>
            <input
              placeholder="Search by brand, model, or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (window.location.href = `/listings?search=${search}`)}
            />
            <button onClick={() => window.location.href = `/listings?search=${search}`}>
              <FiSearch /> Search
            </button>
          </div>
          <div className="hero-actions">
            <Link to="/listings" className="btn btn-primary">Browse All Cars <FiArrowRight /></Link>
            <Link to="/sell" className="btn btn-outline">Sell Your Car</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><h3>500+</h3><p>Cars Listed</p></div>
            <div className="hero-stat"><h3>10K+</h3><p>Happy Buyers</p></div>
            <div className="hero-stat"><h3>50+</h3><p>Cities</p></div>
            <div className="hero-stat"><h3>99%</h3><p>Satisfaction</p></div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="section">
        <div className="section-header">
          <h2>Browse by Brand</h2>
          <p>Explore our curated collection from top automobile manufacturers</p>
        </div>
        <div className="brands-grid">
          {['Suzuki','Audi','BMW','Ford','Honda','KIA'].map(name => {
            const b = brands.find(x => x.name === name);
            return (
              <Link to={`/listings?brand=${name}`} key={name} className="brand-card">
                <div className="brand-card-icon">{BRAND_ICONS[name]}</div>
                <h3>{name}</h3>
                <p>{b ? `${b.count} cars • ${b.models.join(', ')}` : 'Loading...'}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="section" style={{ background: 'var(--bg-secondary)', margin: 0, maxWidth: '100%', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div className="section-header">
            <h2>⭐ Featured Cars</h2>
            <p>Hand-picked premium listings with verified sellers</p>
          </div>
          <div className="cars-grid">
            {featured.slice(0, 6).map(car => (
              <div className="car-card" key={car.id}>
                <div className="car-card-img">
                  <img src={car.images[0]} alt={car.title} onError={e => { e.target.src = 'https://placehold.co/400x250/1a1a2e/6c5ce7?text=' + car.brand; }} />
                  <span className="car-card-badge">Featured</span>
                </div>
                <div className="car-card-body">
                  <div className="car-card-title">{car.title}</div>
                  <div className="car-card-meta">
                    <span><FiCalendar /> {car.year}</span>
                    <span><IoSpeedometer /> {(car.mileage / 1000).toFixed(0)}K km</span>
                    <span><FiDroplet /> {car.fuelType}</span>
                    <span><FiMapPin /> {car.city}</span>
                  </div>
                  <div className="car-card-price">₹{(car.price / 100000).toFixed(1)}L<small> onwards</small></div>
                  {car.seller?.verified && (
                    <div className="car-card-seller">
                      <span className="verified">✅ Verified Seller</span>
                    </div>
                  )}
                  <div className="car-card-footer">
                    <Link to={`/car/${car.id}`} className="btn btn-primary btn-sm">View Details</Link>
                    <Link to="/test-drive" className="btn btn-outline btn-sm">Test Drive</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/listings" className="btn btn-outline">View All Cars <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="section-header">
          <h2>Ready to Sell Your Car?</h2>
          <p>List your car in minutes and reach thousands of verified buyers across India</p>
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/sell" className="btn btn-primary">Sell Your Car <FiArrowRight /></Link>
          <Link to="/test-drive" className="btn btn-outline">Book Test Drive</Link>
          <Link to="/compare" className="btn btn-outline">Compare Cars</Link>
        </div>
      </section>
    </>
  );
}
