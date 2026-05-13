import { useState } from 'react'
import { FiX, FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi'
import API from '../api'

export default function AuthModal({ mode, onSwitch, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'buyer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login' ? { email: form.email, password: form.password } : form;
      const { data } = await API.post(url, payload);
      if (data.success) {
        onSuccess(data.user, data.token);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FiX /></button>
        <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="subtitle">{mode === 'login' ? 'Sign in to your Ришаб Каин account' : 'Join the Ришаб Каин community'}</p>
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label><FiUser style={{ marginRight: 6 }} />Full Name</label>
              <input type="text" placeholder="Rishabh Kain" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
          )}
          <div className="form-group">
            <label><FiMail style={{ marginRight: 6 }} />Email</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label><FiLock style={{ marginRight: 6 }} />Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label><FiPhone style={{ marginRight: 6 }} />Phone</label>
                <input type="tel" placeholder="+91-XXXXX-XXXXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>I want to</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="buyer">Buy Cars</option>
                  <option value="seller">Sell Cars</option>
                </select>
              </div>
            </>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <div className="modal-switch">
          {mode === 'login' ? (
            <>Don't have an account? <a onClick={() => onSwitch('register')}>Sign Up</a></>
          ) : (
            <>Already have an account? <a onClick={() => onSwitch('login')}>Sign In</a></>
          )}
        </div>
      </div>
    </div>
  )
}
