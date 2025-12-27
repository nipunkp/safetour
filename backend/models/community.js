const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: String,
  message: String,
  media: String, // image URL
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
