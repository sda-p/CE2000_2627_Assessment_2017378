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

// naive word stemming - strip common suffixes
function stemWord(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length < 4) return word;

  // strip common suffixes
  if (word.endsWith('ing')) return word.slice(0, -3);
  if (word.endsWith('ed')) return word.slice(0, -2);
  if (word.endsWith('ly')) return word.slice(0, -2);
  if (word.endsWith('es')) return word.slice(0, -2);
  if (word.endsWith('s')) return word.slice(0, -1);

  return word;
}

// group quotes by word stem overlap
// this was producing garbage results - grouping unrelated quotes together
// because common words like "the" and "and" dominate the stem frequency
router.get('/quotes/grouped', async (req, res) => {
  const quotes = await fetchQuotes(20);

  // just return them ungrouped for now while i figure this out
  res.json([ { quotes: quotes } ]);
});

module.exports = router;
