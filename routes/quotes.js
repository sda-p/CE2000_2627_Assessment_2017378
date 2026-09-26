const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  res.render('quotes', { title: 'Quotes', page: page });
});

module.exports = router;
