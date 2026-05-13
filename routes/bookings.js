const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

let bookings = [
  { id: uuidv4(), userId: '2', carId: null, carTitle: 'Suzuki Swift ZXi', date: '2024-02-15', time: '10:00', location: 'Delhi Showroom, Connaught Place', name: 'Test Buyer', phone: '+91-88888-00000', status: 'confirmed', createdAt: new Date(Date.now() - 86400000 * 3) },
  { id: uuidv4(), userId: '2', carId: null, carTitle: 'Kia Seltos HTX+', date: '2024-02-18', time: '14:00', location: 'Hyderabad Showroom, HITEC City', name: 'Test Buyer', phone: '+91-88888-00000', status: 'pending', createdAt: new Date(Date.now() - 86400000) }
];

// GET /api/bookings
router.get('/', (req, res) => {
  const { userId } = req.query;
  let result = [...bookings];
  if (userId) result = result.filter(b => b.userId === userId);
  res.json({ success: true, data: result });
});

// POST /api/bookings
router.post('/', (req, res) => {
  const { userId, carId, carTitle, date, time, location, name, phone } = req.body;
  if (!date || !time || !location || !name || !phone) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  const booking = {
    id: uuidv4(),
    userId: userId || 'guest',
    carId: carId || null,
    carTitle: carTitle || 'General Test Drive',
    date,
    time,
    location,
    name,
    phone,
    status: 'pending',
    createdAt: new Date()
  };
  bookings.unshift(booking);
  res.status(201).json({
    success: true,
    data: booking,
    message: `Test drive booked for ${date} at ${time}! We'll confirm shortly.`
  });
});

// PUT /api/bookings/:id/status
router.put('/:id/status', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  booking.status = req.body.status || booking.status;
  res.json({ success: true, data: booking });
});

// DELETE /api/bookings/:id
router.delete('/:id', (req, res) => {
  const idx = bookings.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found' });
  bookings.splice(idx, 1);
  res.json({ success: true, message: 'Booking cancelled' });
});

module.exports = router;
