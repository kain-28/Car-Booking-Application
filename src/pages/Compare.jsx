import { useState, useEffect } from 'react'
import { FiPlus, FiX } from 'react-icons/fi'
import API from '../api'

export default function Compare() {
  const [cars, setCars] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/cars').then(r => setCars(r.data.data)).catch(() => {});
  }, []);

  const addCar = (car) => {
    if (selected.length < 3 && !selected.find(s => s.id === car.id)) {
      setSelected([...selected, car]);
    }
  };
  const removeCar = (id) => setSelected(selected.filter(s => s.id !== id));

  const filtered = cars.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.brand.toLowerCase().includes(search.toLowerCase())
  ).filter(c => !selected.find(s => s.id === c.id));

  const specs = [
    { label: 'Image', render: c => <img src={c.images[0]} alt={c.title} onError={e => { e.target.src = `https://placehold.co/200x120/1a1a2e/6c5ce7?text=${c.brand}`; }} /> },
    { label: 'Brand', render: c => c.brand },
    { label: 'Model', render: c => c.model },
    { label: 'Year', render: c => c.year },
    { label: 'Price', render: c => <span style={{ color: 'var(--success)', fontWeight: 700 }}>₹{(c.price/100000).toFixed(1)}L</span> },
    { label: 'Mileage', render: c => `${c.mileage.toLocaleString()} km` },
    { label: 'Fuel', render: c => c.fuelType },
    { label: 'Transmission', render: c => c.transmission },
    { label: 'Engine', render: c => c.engine },
    { label: 'Power', render: c => c.power },
    { label: 'Torque', render: c => c.torque || '—' },
    { label: 'Color', render: c => c.color },
    { label: 'Seats', render: c => c.seats },
    { label: 'City', render: c => c.city },
    { label: 'Rating', render: c => `⭐ ${c.rating}` },
    { label: 'Seller', render: c => <>{c.seller?.name} {c.seller?.verified && <span style={{ color: 'var(--success)' }}>✅</span>}</> },
  ];

  return (
    <div className="section" style={{ paddingTop: 100 }}>
      <div className="section-header">
        <h2>⚖️ Compare Cars</h2>
        <p>Select up to 3 cars to compare side by side</p>
      </div>

      {/* Car selector */}
      <div style={{ marginBottom: 32 }}>
        <input
          className="form-group"
          style={{ width: '100%', padding: '14px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: 12 }}
          placeholder="🔍 Search cars to compare..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxHeight: 200, overflow: 'auto' }}>
            {filtered.slice(0, 10).map(car => (
              <button key={car.id} onClick={() => { addCar(car); setSearch(''); }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem' }}>
                <FiPlus /> {car.title} — ₹{(car.price/100000).toFixed(1)}L
              </button>
            ))}
          </div>
        )}
        {/* Selected chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {selected.map(car => (
            <span key={car.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(108,92,231,0.15)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-full)', color: 'var(--accent-light)', fontSize: '0.85rem' }}>
              {car.title}
              <FiX style={{ cursor: 'pointer' }} onClick={() => removeCar(car.id)} />
            </span>
          ))}
        </div>
      </div>

      {selected.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⚖️</div>
          <h3>Select cars to compare</h3>
          <p>Use the search above to add up to 3 cars</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="compare-table">
            <thead>
              <tr>
                <th>Specification</th>
                {selected.map(c => <th key={c.id}>{c.title}</th>)}
              </tr>
            </thead>
            <tbody>
              {specs.map((spec, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{spec.label}</td>
                  {selected.map(c => <td key={c.id}>{spec.render(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
