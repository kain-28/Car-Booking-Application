import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiCalendar, FiDroplet, FiMapPin, FiPhone, FiStar, FiCheck } from 'react-icons/fi'
import { IoSpeedometer, IoColorPalette, IoPeople, IoFlash } from 'react-icons/io5'
import API from '../api'

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCar = useCallback(async () => {
    setLoading(true);
    try {
      const r = await API.get(`/cars/${id}`);
      setCar(r.data.data);
      setSimilar(r.data.similar || []);
      setActiveImg(0);
    } catch {
      setCar(null);
      setSimilar([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    Promise.resolve().then(fetchCar);
  }, [fetchCar]);

  if (loading) return <div className="detail-page"><div className="loader"><div className="spinner"></div></div></div>;
  if (!car) return <div className="detail-page"><div className="empty-state"><h3>Car not found</h3></div></div>;

  return (
    <div className="detail-page">
      <div className="detail-gallery">
        <img src={car.images[activeImg]} alt={car.title}
          onError={e => { e.target.src = `https://placehold.co/800x450/1a1a2e/6c5ce7?text=${car.brand}`; }} />
        {car.images.length > 1 && (
          <div className="detail-gallery-thumbs">
            {car.images.map((img, i) => (
              <img key={i} src={img} alt="" className={i === activeImg ? 'active' : ''}
                onClick={() => setActiveImg(i)}
                onError={e => { e.target.src = `https://placehold.co/100x70/1a1a2e/6c5ce7?text=${i+1}`; }} />
            ))}
          </div>
        )}
      </div>

      <div className="detail-content">
        <div className="detail-info">
          <h1>{car.title}</h1>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span><FiMapPin /> {car.city}</span>
            <span><FiStar style={{ color: 'var(--gold)' }} /> {car.rating} ({car.reviews} reviews)</span>
            {car.seller?.verified && <span style={{ color: 'var(--success)' }}><FiCheck /> Verified</span>}
          </div>
          <div className="detail-price">₹{(car.price / 100000).toFixed(2)} Lakh</div>

          <div className="detail-specs">
            <div className="spec-item">
              <FiCalendar className="spec-icon" />
              <div><div className="spec-label">Year</div><div className="spec-value">{car.year}</div></div>
            </div>
            <div className="spec-item">
              <IoSpeedometer className="spec-icon" />
              <div><div className="spec-label">Mileage</div><div className="spec-value">{car.mileage.toLocaleString()} km</div></div>
            </div>
            <div className="spec-item">
              <FiDroplet className="spec-icon" />
              <div><div className="spec-label">Fuel Type</div><div className="spec-value">{car.fuelType}</div></div>
            </div>
            <div className="spec-item">
              <IoFlash className="spec-icon" />
              <div><div className="spec-label">Transmission</div><div className="spec-value">{car.transmission}</div></div>
            </div>
            <div className="spec-item">
              <IoColorPalette className="spec-icon" />
              <div><div className="spec-label">Color</div><div className="spec-value">{car.color}</div></div>
            </div>
            <div className="spec-item">
              <IoPeople className="spec-icon" />
              <div><div className="spec-label">Seats</div><div className="spec-value">{car.seats}</div></div>
            </div>
          </div>

          <h3 style={{ marginBottom: 8 }}>Engine & Performance</h3>
          <div className="detail-specs" style={{ marginBottom: 24 }}>
            <div className="spec-item">
              <div><div className="spec-label">Engine</div><div className="spec-value">{car.engine}</div></div>
            </div>
            <div className="spec-item">
              <div><div className="spec-label">Power</div><div className="spec-value">{car.power}</div></div>
            </div>
          </div>

          <h3 style={{ marginBottom: 8 }}>Description</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 32 }}>{car.description}</p>

          {similar.length > 0 && (
            <>
              <h3 style={{ marginBottom: 16 }}>Similar Cars</h3>
              <div className="cars-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {similar.map(s => (
                  <Link to={`/car/${s.id}`} className="car-card" key={s.id} style={{ textDecoration: 'none' }}>
                    <div className="car-card-img" style={{ height: 160 }}>
                      <img src={s.images[0]} alt={s.title} onError={e => { e.target.src = `https://placehold.co/300x160/1a1a2e/6c5ce7?text=${s.brand}`; }} />
                    </div>
                    <div className="car-card-body">
                      <div className="car-card-title" style={{ fontSize: '0.95rem' }}>{s.title}</div>
                      <div className="car-card-price" style={{ fontSize: '1.1rem' }}>₹{(s.price/100000).toFixed(1)}L</div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="detail-sidebar">
          <div className="seller-info">
            <div className="seller-avatar">{car.seller?.name?.[0] || 'S'}</div>
            <h3>{car.seller?.name}</h3>
            {car.seller?.verified && <p style={{ color: 'var(--success)', fontSize: '0.85rem' }}>✅ Verified Seller</p>}
          </div>
          <a href={`tel:${car.seller?.phone}`} className="btn btn-primary" style={{ marginBottom: 12 }}>
            <FiPhone /> Contact Seller
          </a>
          <Link to="/test-drive" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
            🚗 Book Test Drive
          </Link>
          <div style={{ marginTop: 24, padding: '16px 0', borderTop: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <p>📞 {car.seller?.phone}</p>
            <p style={{ marginTop: 8 }}>📍 {car.city}</p>
            <p style={{ marginTop: 8 }}>⭐ {car.rating} rating • {car.reviews} reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}
