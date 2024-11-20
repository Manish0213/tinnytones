const express = require("express");
const User = require("../Models/UserSchema");
const upload = require("../middlewares/multerMiddleware");
const jwt = require("jsonwebtoken");

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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Create the artist
    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    const payload = {
      user: {
        id: newUser._id, // Use newArtist instead of artist
      },
    };

    // Generate JWT token
    const token = jwt.sign(payload, JWT_SECRET);

    res.status(201).json({
      success: true,
      message: "Signup successful",
      artist: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
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
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Verify password (Assumes plaintext passwords are stored)
    if (user.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const payload = {
        user: {
        id: user._id,
      },
    };

    // Generate JWT token
    const token = jwt.sign(payload, JWT_SECRET);

    res.status(200).json({
      success: true,
      message: "Sign-in successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token, // Send the generated token
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
