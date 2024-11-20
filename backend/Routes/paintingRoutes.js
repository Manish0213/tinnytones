const express = require('express');
const upload = require('../middlewares/multerMiddleware'); // Path to the multer middleware
const Painting = require('../Models/PaintingSchema'); // Path to the Painting model
const Category = require('../Models/CategorySchema');
const fetchUser = require("../middlewares/fetchUserMiddleware");

const router = express.Router();

// Route to add a new painting with an image upload
router.post('/add-painting', fetchUser, upload.single('image'), async (req, res) => {
  try {
    const { title, category, price } = req.body;

    // Validate required fields
    if (!title || !category || !price || !req.file) {
      return res.status(400).json({ message: 'All fields are required, including an image.' });
    }

    // Fetch artist ID from middleware
    const artistId = req.artist.id; // Assuming fetchUser sets req.user.id

    // Create a new painting instance
    const newPainting = new Painting({
      title,
      artist: artistId, // Store the artist ID here
      image: req.file.path, // Store the file path
      category,
      price,
    });

    // Save the painting to the database
    const savedPainting = await newPainting.save();
    res.status(201).json({
      message: 'Painting added successfully!',
      painting: savedPainting,
    });
  } catch (error) {
    console.error('Error adding painting:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

router.get('/paintings', fetchUser, (req, res) => {
  const artistId = req.artist.id; // Get the artistId from the authenticated user
  Painting.find({ artist: artistId })  // Filter paintings by artistId (artist field)
    .populate('artist', 'name email image')  // Populate the artist field with the artist's details (like name, email, image)
    .populate('category')  // Populate the category field with the full category details
    .then((paintings) => {
      // Normalize the image path by replacing backslashes with forward slashes
      paintings = paintings.map(painting => {
        painting.image = painting.image.replace(/\\/g, '/'); // Replace all backslashes with forward slashes
        return painting;
      });
      res.json({ paintings });
    })
    .catch((err) => {
      console.error('Error fetching paintings:', err);
      res.status(500).json({ error: 'Failed to fetch paintings' });
    });
});

router.post('/add-category', upload.single('image'), async (req, res) => {
  const { name } = req.body;
  try {
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    // Create a new category
    const newCategory = new Category({
      name,
      image: req.file.path  // Save the image path in the category
    });

    // Save the category to the database
    await newCategory.save();

    return res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories from the database
    
    if (!categories) {
      return res.status(404).json({ error: 'No categories found' });
    }
    
    // Loop through each category and update the image path
    categories.forEach(category => {
      // Convert backslashes to forward slashes for the image path
      category.image = category.image.replace(/\\/g, '/');
    });

    return res.status(200).json({ categories }); // Return the updated categories
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

router.get('/paintings/category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Find paintings by category ID
    const paintings = await Painting.find({ category: categoryId })
      .populate('category') // Populate the category field
      .populate('artist');  // Populate the artist field

    // Normalize image paths (if needed)
    const normalizedPaintings = paintings.map((painting) => {
      painting.image = painting.image.replace(/\\/g, '/');
      return painting;
    });

    // Send the response
    res.status(200).json({ paintings: normalizedPaintings });
  } catch (error) {
    console.error('Error fetching paintings by category:', error);
    res.status(500).json({ message: 'Failed to fetch paintings by category' });
  }
});

router.get('/getPaintingsByArtist/:artistId', async (req, res) => {
  const { artistId } = req.params;

  try {
    const paintings = await Painting.find({ artist: artistId })
      .populate('artist') // Populate artist details
      .populate('category'); // Populate category details

    res.json({ paintings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching paintings' });
  }
});

module.exports = router;
