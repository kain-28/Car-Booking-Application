import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiSearch, FiCalendar, FiDroplet, FiMapPin } from 'react-icons/fi'
import { IoSpeedometer } from 'react-icons/io5'
import API from '../api'

export default function Listings() {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    fuelType: '', city: '', transmission: '',
    minPrice: '', maxPrice: '',
    search: searchParams.get('search') || ''
  });

  const fetchCars = useCallback(async (nextFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(nextFilters).forEach(([k, v]) => { if (v) params.set(k, v); });
      const { data } = await API.get(`/cars?${params}`);
      setCars(data.data);
    } catch { setCars([]); }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    Promise.resolve().then(fetchCars);
  }, [fetchCars]);

  const handleFilter = () => fetchCars();
  const clearFilters = () => {
    const emptyFilters = { brand: '', fuelType: '', city: '', transmission: '', minPrice: '', maxPrice: '', search: '' };
    setFilters(emptyFilters);
    fetchCars(emptyFilters);
  };

  return (
    <div className="section" style={{ paddingTop: 100 }}>
      <div className="section-header">
        <h2>🚗 Browse Used Cars</h2>
        <p>Find your dream car from our verified collection</p>
      </div>

      <div className="search-box">
        <input placeholder="Search cars..." value={filters.search}
          onChange={e => setFilters({...filters, search: e.target.value})}
          onKeyDown={e => e.key === 'Enter' && handleFilter()} />
        <button onClick={handleFilter}><FiSearch /> Search</button>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Brand</label>
          <select value={filters.brand} onChange={e => setFilters({...filters, brand: e.target.value})}>
            <option value="">All Brands</option>
            {['Suzuki','Audi','BMW','Ford','Honda','KIA'].map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Fuel Type</label>
          <select value={filters.fuelType} onChange={e => setFilters({...filters, fuelType: e.target.value})}>
            <option value="">All</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Transmission</label>
          <select value={filters.transmission} onChange={e => setFilters({...filters, transmission: e.target.value})}>
            <option value="">All</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>
        <div className="filter-group">
          <label>City</label>
          <select value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})}>
            <option value="">All Cities</option>
            {['Delhi','Mumbai','Bangalore','Pune','Hyderabad','Chennai','Kolkata','Jaipur','Ahmedabad','Lucknow'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Min Price (₹)</label>
          <input type="number" placeholder="0" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} />
        </div>
        <div className="filter-group">
          <label>Max Price (₹)</label>
          <input type="number" placeholder="Any" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <button className="btn btn-primary btn-sm" onClick={handleFilter}>Apply</button>
          <button className="btn btn-outline btn-sm" onClick={clearFilters}>Clear</button>
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>{cars.length} cars found</p>

      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : cars.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No cars found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="cars-grid">
          {cars.map(car => (
            <div className="car-card" key={car.id}>
              <div className="car-card-img">
                <img src={car.images[0]} alt={car.title} onError={e => { e.target.src = `https://placehold.co/400x250/1a1a2e/6c5ce7?text=${car.brand}`; }} />
                {car.featured && <span className="car-card-badge">Featured</span>}
              </div>
              <div className="car-card-body">
                <div className="car-card-title">{car.title}</div>
                <div className="car-card-meta">
                  <span><FiCalendar /> {car.year}</span>
                  <span><IoSpeedometer /> {(car.mileage/1000).toFixed(0)}K km</span>
                  <span><FiDroplet /> {car.fuelType}</span>
                  <span><FiMapPin /> {car.city}</span>
                </div>
                <div className="car-card-price">₹{(car.price/100000).toFixed(1)}L</div>
                {car.seller?.verified && <div className="car-card-seller"><span className="verified">✅ Verified</span></div>}
                <div className="car-card-footer">
                  <Link to={`/car/${car.id}`} className="btn btn-primary btn-sm">View Details</Link>
                  <Link to="/test-drive" className="btn btn-outline btn-sm">Test Drive</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
