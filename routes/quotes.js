// routes for the quotes pages
const express = require('express');
const router = express.Router();

// main quotes page with load-more
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  res.render('quotes', { title: 'Quotes', page: page });
});

// grouped quotes page
router.get('/grouped', (req, res) => {
  res.render('grouped', { title: 'Grouped Quotes' });
});

module.exports = router;
