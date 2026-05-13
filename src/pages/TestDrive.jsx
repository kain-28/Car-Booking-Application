import { useState } from 'react'
import API from '../api'

export default function TestDrive({ user }) {
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', carTitle: '', date: '', time: '', location: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, userId: user?.id || 'guest' };
      await API.post('/bookings', payload);
      setSuccess(true);
    } catch { alert('Error booking test drive'); }
    setLoading(false);
  };

  const update = (k, v) => setForm({ ...form, [k]: v });

  if (success) return (
    <div className="form-page">
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🚗✅</div>
        <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>Test Drive Booked!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>Your test drive has been scheduled for <strong>{form.date}</strong> at <strong>{form.time}</strong></p>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>📍 {form.location}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <a href="/listings" className="btn btn-primary">Browse More Cars</a>
          <button onClick={() => { setSuccess(false); setForm({ name: user?.name || '', phone: '', carTitle: '', date: '', time: '', location: '' }); }} className="btn btn-outline">Book Another</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="form-page">
      <h1>🏁 Book a Test Drive</h1>
      <p>Experience your dream car before you buy — absolutely free!</p>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Your Name</label>
              <input placeholder="Full name" value={form.name} onChange={e => update('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="+91-XXXXX-XXXXX" value={form.phone} onChange={e => update('phone', e.target.value)} required />
            </div>
            <div className="form-group full">
              <label>Car You Want to Test Drive</label>
              <input placeholder="e.g. Kia Seltos HTX+" value={form.carTitle} onChange={e => update('carTitle', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Preferred Date</label>
              <input type="date" value={form.date} onChange={e => update('date', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Preferred Time</label>
              <select value={form.time} onChange={e => update('time', e.target.value)} required>
                <option value="">Select Time</option>
                {['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label>Preferred Location</label>
              <select value={form.location} onChange={e => update('location', e.target.value)} required>
                <option value="">Select Showroom</option>
                <option>Delhi Showroom — Connaught Place</option>
                <option>Mumbai Showroom — Andheri West</option>
                <option>Bangalore Showroom — Indiranagar</option>
                <option>Hyderabad Showroom — HITEC City</option>
                <option>Pune Showroom — Hinjewadi</option>
                <option>Chennai Showroom — Anna Nagar</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Booking...' : '🚗 Confirm Test Drive'}
          </button>
        </form>
      </div>
      <div style={{ marginTop: 40, background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: 32, border: '1px solid var(--border)' }}>
        <h3 style={{ marginBottom: 16 }}>How It Works</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {[
            { icon: '📝', title: 'Fill the Form', desc: 'Choose your car, date & location' },
            { icon: '📱', title: 'Get Confirmation', desc: 'We confirm via SMS & email' },
            { icon: '🚗', title: 'Test Drive', desc: 'Visit showroom and drive your dream car' },
            { icon: '🤝', title: 'Make a Deal', desc: 'Love it? Buy it right away!' }
          ].map((step, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{step.icon}</div>
              <h4 style={{ marginBottom: 4 }}>{step.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
