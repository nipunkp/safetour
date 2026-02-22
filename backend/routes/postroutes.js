const express = require('express');
const router = express.Router();
const Post = require('../models/community');
const { getDistanceKm } = require('../utils/distance');

// 🔥 Get posts within 20km
router.get('/', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location required' });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const posts = await Post.find().sort({ _id: -1 });

    const nearbyPosts = posts.filter(post => {
      if (!post.latitude || !post.longitude) return false;

      const distance = getDistanceKm(
        userLat,
        userLon,
        post.latitude,
        post.longitude
      );

      return distance <= 20; // 🔥 20KM FILTER
    });

    res.json(nearbyPosts);
  } catch (err) {
    console.error('Post fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// 🔥 Save new post
router.post('/', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();

    res.status(201).json({ message: 'Post saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save post' });
  }
});

module.exports = router;
