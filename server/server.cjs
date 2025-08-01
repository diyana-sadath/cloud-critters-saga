// Load environment variables
require('dotenv').config();

// Import required modules
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');

// Initialize express app
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Hugging Face model URL
const MODEL_URL = 'https://api-inference.huggingface.co/models/nielsr/vit-gpt2-image-captioning';

// Your Hugging Face API Key
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Upload endpoint
app.post('/api/generate', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    // Send image buffer directly
    const hfResponse = await axios.post(
      MODEL_URL,
      req.file.buffer,
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
      }
    );

    let caption = hfResponse.data?.[0]?.generated_text || 'A mysterious cloud creature appears!';

    // Try to parse name + story from caption using simple heuristics
    let name = 'Unnamed Fluff';
    let story = caption;

    const nameMatch = caption.match(/named\s+([A-Z][a-zA-Z]+)/);
    if (nameMatch) {
      name = nameMatch[1];
    } else if (caption.split(' ')[0].length < 16) {
      name = caption.split(' ')[0]; // first word, if short enough
    }

    res.json({
      name,
      story,
    });

  } catch (error) {
    console.error('💥 Error processing image:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to process image',
      details: error.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
