const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    title: String,
    message: String,

    latitude: Number,
    longitude: Number,

    radiusKm: {
      type: Number,
      default: 20, // 20 km
    },

    createdBy: {
      type: String, // authority name
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
