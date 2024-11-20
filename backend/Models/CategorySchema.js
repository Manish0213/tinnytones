const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,  // Ensure that the category name is unique
  },
  image: {
    type: String,  // Store the image path as a string
    required: true,  // Make image field required
  },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
