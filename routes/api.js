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

// group quotes by shared tags (first attempt at similarity)
router.get('/quotes/grouped', async (req, res) => {
  const quotes = await fetchQuotes(20);

  // group by first tag
  const groups = {};
  quotes.forEach(function(q) {
    if (q.tags && q.tags.length > 0) {
      const tag = q.tags[0].toLowerCase();
      if (!groups[tag]) {
        groups[tag] = { tag: tag, quotes: [] };
      }
      groups[tag].quotes.push(q);
    }
  });

  res.json(Object.values(groups));
});

module.exports = router;
