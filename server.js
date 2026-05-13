const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const carsRouter = require('./routes/cars');
const authRouter = require('./routes/auth');
const bookingsRouter = require('./routes/bookings');
const usersRouter = require('./routes/users');

app.use('/api/cars', carsRouter);
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/users', usersRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Ришаб Каин Car Marketplace API Running', time: new Date() });
});

app.listen(PORT, () => {
  console.log(`\n🚗 Rishab Kain Car Marketplace API`);
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
