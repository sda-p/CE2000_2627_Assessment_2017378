const express = require('express');
const app = express();
const PORT = 9500;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { title: 'Quote Cluster' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('server running on port ' + PORT);
});
