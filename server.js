// quote cluster - main express server
const express = require('express');
const app = express();
const PORT = 9500;

// route modules
const quotesRouter = require('./routes/quotes');
const apiRouter = require('./routes/api');

// serve static files and set up template engine
app.use(express.static('public'));
app.set('view engine', 'ejs');

// home page
app.get('/', (req, res) => {
  res.render('index', { title: 'Quote Cluster' });
});

// mount route modules
app.use('/quotes', quotesRouter);
app.use('/api', apiRouter);

// catch-all for undefined routes
app.get('*', (req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('server running on port ' + PORT);
});
