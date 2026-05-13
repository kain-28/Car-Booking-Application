import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'

export default function Dashboard({ user }) {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      API.get(`/bookings?userId=${user.id}`).then(r => setBookings(r.data.data)).catch(() => {});
    }
    API.get('/users/stats/overview').then(r => setStats(r.data.data)).catch(() => {});
  }, [user]);

  if (!user) return (
    <div className="form-page">
      <div className="empty-state" style={{ paddingTop: 80 }}>
        <div className="empty-icon">🔒</div>
        <h3>Please sign in to access your dashboard</h3>
      </div>
    </div>
  );

  const cancelBooking = async (id) => {
    try {
      await API.delete(`/bookings/${id}`);
      setBookings(bookings.filter(b => b.id !== id));
    } catch { alert('Error cancelling booking'); }
  };

  return (
    <div className="dashboard">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 4 }}>Welcome, {user.name}! 👋</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Role: <strong style={{ color: 'var(--accent-light)' }}>{user.role?.toUpperCase()}</strong> • {user.email}</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="dashboard-grid">
          <div className="stat-card">
            <h4>Total Listings</h4>
            <div className="stat-value">{stats.totalListings}</div>
            <div className="stat-change">Active on platform</div>
          </div>
          <div className="stat-card">
            <h4>Your Bookings</h4>
            <div className="stat-value">{bookings.length}</div>
            <div className="stat-change">Test drives</div>
          </div>
          <div className="stat-card">
            <h4>Top Brand</h4>
            <div className="stat-value">{stats.topBrand}</div>
            <div className="stat-change">Most popular</div>
          </div>
          <div className="stat-card">
            <h4>Growth</h4>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.monthlyGrowth}</div>
            <div className="stat-change">This month</div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
        <Link to="/sell" className="btn btn-primary">➕ Sell a Car</Link>
        <Link to="/listings" className="btn btn-outline">🔍 Browse Cars</Link>
        <Link to="/test-drive" className="btn btn-outline">🚗 Book Test Drive</Link>
        <Link to="/compare" className="btn btn-outline">⚖️ Compare Cars</Link>
      </div>

      {/* Bookings Table */}
      <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Your Test Drive Bookings</h2>
      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No bookings yet</h3>
          <p>Book a test drive to see it here</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="compare-table">
            <thead>
              <tr>
                <th>Car</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.carTitle}</td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td>{b.location}</td>
                  <td>
                    <span style={{
                      padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600,
                      background: b.status === 'confirmed' ? 'rgba(0,206,201,0.15)' : 'rgba(253,203,110,0.15)',
                      color: b.status === 'confirmed' ? 'var(--success)' : 'var(--warning)'
                    }}>
                      {b.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => cancelBooking(b.id)} className="btn btn-sm" style={{ background: 'rgba(255,107,107,0.15)', color: 'var(--danger)', fontSize: '0.8rem', padding: '6px 14px' }}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
