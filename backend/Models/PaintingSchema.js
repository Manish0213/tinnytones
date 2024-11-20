const mongoose = require('mongoose');
const Category = require('../Models/CategorySchema');
const Artist = require('../Models/ArtistSchema');

// Define the painting schema
const paintingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    trim: true,
    ref: Artist
  },
  image: {
    type: String,
    required: true,
    trim: true, // Ensures no unnecessary whitespace
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Category
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Ensures price cannot be negative
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create the model
const Painting = mongoose.model('Painting', paintingSchema);

module.exports = Painting;
