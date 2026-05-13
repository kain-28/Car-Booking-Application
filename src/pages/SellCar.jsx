import { useState } from 'react'
import { FiUpload } from 'react-icons/fi'
import API from '../api'

export default function SellCar({ user, onOpenAuth }) {
  const [form, setForm] = useState({
    title: '', brand: 'Suzuki', model: '', year: 2023, price: '',
    mileage: '', fuelType: 'Petrol', transmission: 'Manual', color: '',
    city: '', seats: 5, engine: '', power: '', torque: '', description: '',
    images: []
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { onOpenAuth('register'); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        mileage: Number(form.mileage),
        year: Number(form.year),
        seats: Number(form.seats),
        images: form.images.length ? form.images : [`https://placehold.co/400x250/1a1a2e/6c5ce7?text=${form.brand}+${form.model}`],
        seller: { name: user.name, phone: user.phone || '+91-XXXXX-XXXXX', verified: false }
      };
      await API.post('/cars', payload);
      setSuccess(true);
    } catch { alert('Error submitting listing'); }
    setLoading(false);
  };

  const update = (key, val) => setForm({ ...form, [key]: val });

  if (success) return (
    <div className="form-page">
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>Listing Submitted!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Your car has been listed on Ришаб Каин marketplace.</p>
        <a href="/listings" className="btn btn-primary">View Listings</a>
      </div>
    </div>
  );

  return (
    <div className="form-page">
      <h1>🚙 Sell Your Car</h1>
      <p>List your car on Ришаб Каин and reach thousands of buyers</p>
      {!user && <div className="alert alert-error">⚠️ Please <a onClick={() => onOpenAuth('login')} style={{ color: 'var(--accent-light)', cursor: 'pointer', fontWeight: 600 }}>sign in</a> first to sell your car</div>}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full">
              <label>Listing Title</label>
              <input placeholder="e.g. Suzuki Swift ZXi 2022" value={form.title} onChange={e => update('title', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Brand</label>
              <select value={form.brand} onChange={e => update('brand', e.target.value)}>
                {['Suzuki','Audi','BMW','Ford','Honda','KIA'].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Model</label>
              <input placeholder="e.g. Swift, A4, X1" value={form.model} onChange={e => update('model', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Year</label>
              <input type="number" min="2000" max="2026" value={form.year} onChange={e => update('year', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" placeholder="e.g. 750000" value={form.price} onChange={e => update('price', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Mileage (km)</label>
              <input type="number" placeholder="e.g. 22000" value={form.mileage} onChange={e => update('mileage', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Fuel Type</label>
              <select value={form.fuelType} onChange={e => update('fuelType', e.target.value)}>
                <option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Electric</option><option>CNG</option>
              </select>
            </div>
            <div className="form-group">
              <label>Transmission</label>
              <select value={form.transmission} onChange={e => update('transmission', e.target.value)}>
                <option>Manual</option><option>Automatic</option>
              </select>
            </div>
            <div className="form-group">
              <label>Color</label>
              <input placeholder="e.g. Pearl White" value={form.color} onChange={e => update('color', e.target.value)} />
            </div>
            <div className="form-group">
              <label>City</label>
              <select value={form.city} onChange={e => update('city', e.target.value)} required>
                <option value="">Select City</option>
                {['Delhi','Mumbai','Bangalore','Pune','Hyderabad','Chennai','Kolkata','Jaipur','Ahmedabad','Lucknow'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Engine</label>
              <input placeholder="e.g. 1.2L Petrol" value={form.engine} onChange={e => update('engine', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Power</label>
              <input placeholder="e.g. 89 bhp" value={form.power} onChange={e => update('power', e.target.value)} />
            </div>
            <div className="form-group full">
              <label>Image URLs (comma-separated)</label>
              <input placeholder="https://example.com/car1.jpg, https://example.com/car2.jpg"
                onChange={e => update('images', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
            </div>
            <div className="form-group full">
              <label>Description</label>
              <textarea placeholder="Describe your car's condition, features, service history..." value={form.description} onChange={e => update('description', e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading || !user}>
            {loading ? 'Submitting...' : <><FiUpload /> Submit Listing</>}
          </button>
        </form>
      </div>
    </div>
  );
}
