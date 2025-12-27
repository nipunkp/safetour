const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['tourist', 'authority'] },

    latitude: Number,
    longitude: Number,
});

module.exports = mongoose.model('User', UserSchema);
