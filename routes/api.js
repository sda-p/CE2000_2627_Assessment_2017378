const express = require('express');
const router = express.Router();

// fetch quotes from quotable api
async function fetchQuotes(limit) {
  try {
    const response = await fetch('https://api.quotable.io/quotes/random?limit=' + limit);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('api error:', err);
    return [];
  }
}

router.get('/quotes/random', async (req, res) => {
  const limit = req.query.limit || 5;
  const quotes = await fetchQuotes(limit);
  res.json(quotes);
});

module.exports = router;
