const express = require('express');
const router = express.Router();
const Alert = require('../models/alert');
const { getDistanceKm } = require('../utils/distance');

router.get('/', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location required' });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const alerts = await Alert.find();

    const nearbyAlerts = alerts.filter(alert => {
      if (!alert.latitude || !alert.longitude) return false;

      const distance = getDistanceKm(
        userLat,
        userLon,
        alert.latitude,
        alert.longitude
      );

      return distance <= 20; // 🔥 20 KM RADIUS
    });

    res.json(nearbyAlerts);
  } catch (err) {
    console.error('Alert fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

module.exports = router;
