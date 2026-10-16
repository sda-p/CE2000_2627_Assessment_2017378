const express = require('express');
const router = express.Router();

// some test quotes for when the api is down
const testQuotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", tags: ["work"] },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", tags: ["success"] },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", tags: ["dreams"] },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", tags: ["perseverance"] },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", tags: ["life"] },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker", tags: ["future"] },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", tags: ["opportunity"] },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", tags: ["journey"] },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", tags: ["fear"] },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", tags: ["happiness"] }
];

// fetch quotes from quotable api, fall back to test data
async function fetchQuotes(limit) {
  try {
    const response = await fetch('https://api.quotable.io/quotes/random?limit=' + limit);
    if (!response.ok) {
      throw new Error('api returned ' + response.status);
    }
    const data = await response.json();
    return data;
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
