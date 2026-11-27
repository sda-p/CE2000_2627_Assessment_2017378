// quote cluster - main express server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 9500;

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

// favicon fallback - returns a simple svg as ico
app.get('/favicon.ico', (req, res) => {
  res.type('image/svg+xml').send(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#0d6efd"/><text x="50" y="55" font-size="40" font-weight="bold" text-anchor="middle" fill="white">"</text></svg>'
  );
});

// catch-all for undefined routes
app.get('*', (req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('server running on port ' + PORT);
});
