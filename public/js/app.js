// main app js - handles the home page
console.log('app loaded');

// colors for the card borders - cycles through them
const cardColors = ['#0d6efd', '#198754', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14'];

// fetch and display some random quotes from the api
async function loadQuotes() {
  const content = document.getElementById('content');
  content.innerHTML = '<p class="text-muted">loading quotes...</p>';

  try {
    const res = await fetch('/api/quotes/random?limit=5');
    const quotes = await res.json();

    let html = '';
    quotes.forEach(function(q, i) {
      // cycle through the colors
      const color = cardColors[i % cardColors.length];
      html += '<div class="quote-card" style="border-left-color: ' + color + '">';
      html += '<p class="quote-text">"' + q.text + '"</p>';
      html += '<p class="quote-author">- ' + q.author + '</p>';
      html += '</div>';
    });

    content.innerHTML = html;
  } catch (err) {
    content.innerHTML = '<p class="text-danger">error loading quotes</p>';
  }
}

// load quotes when the page loads
loadQuotes();
