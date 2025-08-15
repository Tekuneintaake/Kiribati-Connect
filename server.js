require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

const app = express();
app.use(cors()); // Allow frontend requests
app.use(express.json());

// Configure Cloudinary (free tier)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer for temporary file storage
const upload = multer({ dest: 'uploads/' });

// Image Upload Endpoint
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'social-media-posts',
    });

    // Save this to your database (e.g., MongoDB, Firebase)
    const postData = {
      imageUrl: result.secure_url,
      caption: req.body.caption, // Optional
      createdAt: new Date(),
    };

    // Here, you'd save `postData` to your DB
    // Example: await PostModel.create(postData);

    res.status(200).json({ success: true, post: postData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
