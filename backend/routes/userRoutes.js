const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { getDistanceKm } = require('../utils/distance');

router.get('/nearby', async (req, res) => {
  const { latitude, longitude } = req.query;

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  const users = await User.find({ role: 'tourist' });

  const nearby = users.filter(u => {
    if (!u.latitude || !u.longitude) return false;
    return getDistanceKm(lat, lon, u.latitude, u.longitude) <= 20;
  });

  res.json(nearby);
});

module.exports = router;
