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

function getWordStems(text) {
  const words = text.split(/\s+/);
  const stems = {};
  words.forEach(function(w) {
    const stem = stemWord(w);
    if (stem.length > 0) {
      stems[stem] = (stems[stem] || 0) + 1;
    }
  });
  return stems;
}

// group quotes by word stem overlap
router.get('/quotes/grouped', async (req, res) => {
  const quotes = await fetchQuotes(20);

  // build stem frequency for each quote
  const quoteStems = quotes.map(function(q) {
    return getWordStems(q.text);
  });

  // group quotes that share stems
  const groups = [];
  const used = new Set();

  quotes.forEach(function(q, i) {
    if (used.has(i)) return;

    const group = { quotes: [q], stems: quoteStems[i] };
    used.add(i);

    // find similar quotes to add to group
    quotes.forEach(function(q2, j) {
      if (used.has(j) || i === j) return;

      let shared = 0;
      Object.keys(quoteStems[j]).forEach(function(stem) {
        if (group.stems[stem]) shared++;
      });

      if (shared >= 3) {
        group.quotes.push(q2);
        used.add(j);
      }
    });

    groups.push(group);
  });

  res.json(groups);
});

module.exports = router;
