const express = require('express');
const router = express.Router();
const axios = require('axios');

const WEATHER_KEY = process.env.WEATHER_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;


/* ------------------- WEATHER ------------------- */
router.get('/weather', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          appid: WEATHER_KEY,
          units: 'metric',
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Weather fetch failed' });
  }
});

/* ------------------- REVERSE GEOCODE ------------------- */
router.get('/reverse', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json',
          addressdetails:1,
          zoom:14
        },
        headers: {
          'User-Agent': 'SafeTour-App',
        },
      }
    );

    console.log("FULL ADDRESS OBJECT:", response.data.address);
    const addr = response.data.address;
    const city =
      addr.city ||
      addr.town ||
      addr.county ||         
      addr.state_district ||
      addr.suburb ||
      addr.village ||
      addr.state_district ||
      addr.state ||
      "Unknown";
    
    res.json({ city });
  } catch (err) {
    res.status(500).json({ error: 'City fetch failed' });
  }
});

/* ------------------- GEMINI AI GUIDELINES ------------------- */
router.get('/ai-guidelines', async (req, res) => {
    try {
      const { city } = req.query;
  
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Provide travel safety tips for tourists visiting ${city}.
                  
  Structure as:
  
  Do's:
  - ...
  - ...
  
  Don'ts:
  - ...
  - ...
  
  Keep it short and practical.`
                }
              ]
            }
          ]
        }
      );
  
      const text =
        response.data.candidates[0].content.parts[0].text;
  
      res.json({ guidelines: text });
  
    } catch (err) {
      console.error("Gemini Error:", err.response?.data || err.message);
      res.status(500).json({ error: "AI generation failed" });
    }
  });
  
  router.get('/list-models', async (req, res) => {
    try {
      const response = await axios.get(
        `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
      );
  
      res.json(response.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      res.status(500).json({ error: "Failed to list models" });
    }
  });
  
module.exports = router;
