const mongoose = require('mongoose');

// Artist schema definition
const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  image: {
    type: String, // Image file path
    required: false,
    trim: true,
  },
}, {
  timestamps: true,
});

// Model creation
const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
