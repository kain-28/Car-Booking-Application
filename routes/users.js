const express = require('express');
const router = express.Router();

// Wishlist management
const wishlists = {};

// GET /api/users/:id/wishlist
router.get('/:id/wishlist', (req, res) => {
  const list = wishlists[req.params.id] || [];
  res.json({ success: true, data: list });
});

// POST /api/users/:id/wishlist
router.post('/:id/wishlist', (req, res) => {
  const { carId } = req.body;
  if (!wishlists[req.params.id]) wishlists[req.params.id] = [];
  if (!wishlists[req.params.id].includes(carId)) {
    wishlists[req.params.id].push(carId);
  }
  res.json({ success: true, data: wishlists[req.params.id], message: 'Added to wishlist' });
});

// DELETE /api/users/:id/wishlist/:carId
router.delete('/:id/wishlist/:carId', (req, res) => {
  if (wishlists[req.params.id]) {
    wishlists[req.params.id] = wishlists[req.params.id].filter(id => id !== req.params.carId);
  }
  res.json({ success: true, data: wishlists[req.params.id] || [], message: 'Removed from wishlist' });
});

// GET /api/users/stats — admin dashboard stats
router.get('/stats/overview', (req, res) => {
  res.json({
    success: true,
    data: {
      totalListings: 16,
      totalUsers: 3,
      totalBookings: 2,
      pendingApprovals: 1,
      revenue: '₹24,50,000',
      topBrand: 'KIA',
      monthlyGrowth: '+18%'
    }
  });
});

module.exports = router;
