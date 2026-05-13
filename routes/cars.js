const express = require('express');
const router = express.Router();
const { carsData } = require('../data/cars');

let cars = [...carsData];

// GET /api/cars — list with filters
router.get('/', (req, res) => {
  let result = [...cars];
  const { brand, fuelType, city, minPrice, maxPrice, minYear, maxYear, transmission, search, featured } = req.query;

  if (brand) result = result.filter(c => c.brand.toLowerCase() === brand.toLowerCase());
  if (fuelType) result = result.filter(c => c.fuelType.toLowerCase() === fuelType.toLowerCase());
  if (city) result = result.filter(c => c.city.toLowerCase().includes(city.toLowerCase()));
  if (minPrice) result = result.filter(c => c.price >= Number(minPrice));
  if (maxPrice) result = result.filter(c => c.price <= Number(maxPrice));
  if (minYear) result = result.filter(c => c.year >= Number(minYear));
  if (maxYear) result = result.filter(c => c.year <= Number(maxYear));
  if (transmission) result = result.filter(c => c.transmission.toLowerCase() === transmission.toLowerCase());
  if (featured === 'true') result = result.filter(c => c.featured);
  if (search) {
    const s = search.toLowerCase();
    result = result.filter(c =>
      c.title.toLowerCase().includes(s) ||
      c.brand.toLowerCase().includes(s) ||
      c.model.toLowerCase().includes(s) ||
      c.city.toLowerCase().includes(s)
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

// GET /api/cars/brands — unique brands summary
router.get('/brands', (req, res) => {
  const brands = {};
  cars.forEach(c => {
    if (!brands[c.brand]) brands[c.brand] = { name: c.brand, count: 0, models: new Set() };
    brands[c.brand].count++;
    brands[c.brand].models.add(c.model);
  });
  const result = Object.values(brands).map(b => ({ ...b, models: [...b.models] }));
  res.json({ success: true, data: result });
});

// GET /api/cars/:id
router.get('/:id', (req, res) => {
  const car = cars.find(c => c.id === req.params.id);
  if (!car) return res.status(404).json({ success: false, message: 'Car not found' });

  const similar = cars.filter(c => c.brand === car.brand && c.id !== car.id).slice(0, 3);
  res.json({ success: true, data: car, similar });
});

// POST /api/cars — add new listing
router.post('/', (req, res) => {
  const { v4: uuidv4 } = require('uuid');
  const newCar = {
    id: uuidv4(),
    ...req.body,
    status: 'available',
    featured: false,
    rating: 0,
    reviews: 0,
    createdAt: new Date()
  };
  cars.unshift(newCar);
  res.status(201).json({ success: true, data: newCar, message: 'Listing submitted successfully!' });
});

// PUT /api/cars/:id
router.put('/:id', (req, res) => {
  const idx = cars.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Car not found' });
  cars[idx] = { ...cars[idx], ...req.body };
  res.json({ success: true, data: cars[idx] });
});

// DELETE /api/cars/:id
router.delete('/:id', (req, res) => {
  const idx = cars.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Car not found' });
  cars.splice(idx, 1);
  res.json({ success: true, message: 'Listing removed' });
});

// GET /api/cars/compare?ids=id1,id2,id3
router.get('/compare/models', (req, res) => {
  const ids = req.query.ids ? req.query.ids.split(',') : [];
  const compared = cars.filter(c => ids.includes(c.id));
  res.json({ success: true, data: compared });
});

module.exports = router;
