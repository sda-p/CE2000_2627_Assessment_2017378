const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  res.render('quotes', { title: 'Quotes', page: page });
});

router.get('/grouped', (req, res) => {
  res.render('grouped', { title: 'Grouped Quotes' });
});

module.exports = router;
