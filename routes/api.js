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

// give up on fancy nlp stuff, just count shared words
function sharedWords(text1, text2) {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = text2.toLowerCase().split(/\s+/);
  let count = 0;
  words2.forEach(function(w) {
    if (words1.has(w)) count++;
  });
  return count;
}

// group quotes that share at least N words
router.get('/quotes/grouped', async (req, res) => {
  const quotes = await fetchQuotes(15);
  const threshold = 2;

  const groups = [];
  const used = new Set();

  quotes.forEach(function(q, i) {
    if (used.has(i)) return;

    const group = { quotes: [q] };
    used.add(i);

    quotes.forEach(function(q2, j) {
      if (used.has(j) || i === j) return;
      if (sharedWords(q.text, q2.text) >= threshold) {
        group.quotes.push(q2);
        used.add(j);
      }
    });

    if (group.quotes.length > 1) {
      groups.push(group);
    }
  });

  res.json(groups);
});

module.exports = router;
