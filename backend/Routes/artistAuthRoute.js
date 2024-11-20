const express = require("express");
const Artist = require("../Models/ArtistSchema");
const upload = require("../middlewares/multerMiddleware");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middlewares/fetchUserMiddleware");

const JWT_SECRET = "I M SECRET";

const router = express.Router();

// Artist signup route
router.post("/signup", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the email is already in use
    const existingArtist = await Artist.findOne({ email });
    if (existingArtist) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Create the artist
    const newArtist = new Artist({
      name,
      email,
      password,
      image: req.file ? req.file.path : null, // Handle image upload
    });

    await newArtist.save();

    const payload = {
      artist: {
        id: newArtist._id, // Use newArtist instead of artist
      },
    };

    // Generate JWT token
    const token = jwt.sign(payload, JWT_SECRET);

    res.status(201).json({
      success: true,
      message: "Signup successful",
      artist: {
        id: newArtist._id,
        name: newArtist.name,
        email: newArtist.email,
        image: newArtist.image ? newArtist.image.replace(/\\/g, "/") : null, // Normalize path
      },
      token, // Send the generated token
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Check if artist exists
    const artist = await Artist.findOne({ email });
    if (!artist) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Verify password (Assumes plaintext passwords are stored)
    if (artist.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const payload = {
      artist: {
        id: artist._id,
      },
    };

    // Generate JWT token
    const token = jwt.sign(payload, JWT_SECRET);

    res.status(200).json({
      success: true,
      message: "Sign-in successful",
      artist: {
        id: artist._id,
        name: artist.name,
        email: artist.email,
        image: artist.image ? artist.image.replace(/\\/g, "/") : null, // Normalize path
      },
      token, // Send the generated token
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/getAllArtist", async (req, res) => {
  try {
    const artists = await Artist.find();

    // Normalize the image paths (replace backslashes with forward slashes)
    const normalizedArtists = artists.map((artist) => ({
      ...artist._doc,
      image: artist.image ? artist.image.replace(/\\/g, "/") : null,
    }));

    res.status(200).json({ artists: normalizedArtists });
  } catch (error) {
    console.error("Error fetching artists:", error);
    res.status(500).json({ message: "Failed to fetch artists" });
  }
});

router.get("/artistInfo", fetchUser, async (req, res) => {
  const artist = await Artist.findOne({ _id: req.artist.id });
  res.status(200).json(artist);
});

module.exports = router;
