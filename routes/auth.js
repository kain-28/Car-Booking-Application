const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'rishabh_kain_cars_secret_2024';

// In-memory users store
let users = [
  { id: '1', name: 'Admin Rishabh', email: 'admin@rishabhkain.com', password: bcrypt.hashSync('admin123', 10), role: 'admin', avatar: null, phone: '+91-98765-00000', wishlist: [], createdAt: new Date() },
  { id: '2', name: 'Test Buyer', email: 'buyer@test.com', password: bcrypt.hashSync('test123', 10), role: 'buyer', avatar: null, phone: '+91-88888-00000', wishlist: [], createdAt: new Date() },
  { id: '3', name: 'Test Seller', email: 'seller@test.com', password: bcrypt.hashSync('test123', 10), role: 'seller', avatar: null, phone: '+91-77777-00000', wishlist: [], createdAt: new Date() }
];

const generateToken = (user) => jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });
    if (users.find(u => u.email === email)) return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = { id: String(users.length + 1), name, email, password: hashed, phone: phone || '', role: role || 'buyer', avatar: null, wishlist: [], createdAt: new Date() };
    users.push(newUser);

    const token = generateToken(newUser);
    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ success: true, token, user: safeUser, message: 'Account created successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;
    res.json({ success: true, token, user: safeUser, message: `Welcome back, ${user.name}!` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;
module.exports.users = users;
module.exports.JWT_SECRET = JWT_SECRET;
