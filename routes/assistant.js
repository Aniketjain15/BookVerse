const express = require('express');
const axios = require('axios');
const router = express.Router();

require('dotenv').config();

router.post('/ask-gemini', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    res.json({ reply: response.data.candidates[0].content.parts[0].text });
  } catch (error) {
    res.status(500).json({ error: 'Gemini API error', details: error.message });
  }
});

module.exports = router;