const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const axios = require('axios');

router.post('/id-verify', authMiddleware, async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      {
        requests: [
          {
            image: {
              content: imageBase64.split(',')[1]
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 10
              }
            ]
          }
        ]
      }
    );

    const textAnnotations = response.data.responses[0].textAnnotations;

    if (!textAnnotations || textAnnotations.length === 0) {
      return res.json({
        verified: false,
        message: 'No text found in the image! Please show a valid ID card!'
      });
    }

    const detectedText = textAnnotations[0].description.toLowerCase();
    console.log('Detected text:', detectedText);

    // Agar koi bhi text detect hua toh valid ID maano
    // Minimum 20 characters hone chahiye
    if (detectedText.length > 20) {
      res.json({
        verified: true,
        message: 'ID verified successfully!'
      });
    } else {
      res.json({
        verified: false,
        message: 'Could not detect enough text. Please hold your ID card closer to the camera!'
      });
    }

  } catch (err) {
    console.log('Vision API error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;