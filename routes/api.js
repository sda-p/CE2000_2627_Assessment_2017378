const express = require('express');
const router = express.Router();

// local quote bank for when the api is down or for demo purposes
const fs = require('fs');
const path = require('path');
const quotesFile = path.join(__dirname, '..', 'public', 'data', 'quotes.json');
const testQuotes = JSON.parse(fs.readFileSync(quotesFile, 'utf8'));

// fetch quotes from type.fit api, fall back to test data
async function fetchQuotes(limit) {
  try {
    const response = await fetch('https://type.fit/api/quotes');
    if (!response.ok) {
      throw new Error('api returned ' + response.status);
    }
    const data = await response.json();
    // return random subset
    const shuffled = data.sort(function() { return Math.random() - 0.5; });
    return shuffled.slice(0, limit);
  } catch (err) {
    console.error('api error:', err.message);
    // fall back to test data
    const shuffled = testQuotes.slice(0, limit);
    return shuffled;
  }
}

router.get('/quotes/random', async (req, res) => {
  const limit = req.query.limit || 5;
  const quotes = await fetchQuotes(limit);
  res.json(quotes);
});

// serve local quote bank (for quotes page load-more)
router.get('/quotes/local', (req, res) => {
  res.json(testQuotes);
});

// paginated quotes from dummyjson api
// using this instead of the local file so the page actually uses an api
router.get('/quotes/page', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    
    const response = await fetch('https://dummyjson.com/quotes?limit=' + limit + '&skip=' + skip);
    const data = await response.json();
    
    // dummyjson uses 'quote' not 'text', normalize it
    const normalized = data.quotes.map(function(q) {
      return { text: q.quote, author: q.author };
    });
    
    res.json({ quotes: normalized, total: data.total, page: page });
  } catch (err) {
    console.error('dummyjson error:', err.message);
    res.status(500).json({ error: 'failed to load quotes' });
  }
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
// uses local quote bank for demo purposes (api only has 5 quotes)
router.get('/quotes/grouped', async (req, res) => {
  const quotes = testQuotes;
  const threshold = 3;

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

// wikipedia author lookup - proxies the wikipedia rest api
// wikimedia requires a descriptive user-agent so we set one here
router.get('/wiki/summary/:author', async (req, res) => {
  try {
    // replace spaces with underscores for the wikipedia url
    const author = req.params.author.replace(/\s+/g, '_');
    const url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + author;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'quote-cluster-ce2000/1.0 (student project) https://localhost:9500'
      }
    });
    
    if (response.status === 404) {
      res.status(404).json({ error: 'no wikipedia page found for ' + author });
      return;
    }
    
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('wikipedia error:', err.message);
    res.status(500).json({ error: 'failed to fetch wikipedia summary' });
  }
});

module.exports = router;
