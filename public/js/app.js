// main app js
console.log('app loaded');

async function loadQuotes() {
  const content = document.getElementById('content');
  content.innerHTML = '<p class="text-muted">loading quotes...</p>';

  try {
    const res = await fetch('/api/quotes/random?limit=5');
    const quotes = await res.json();

    let html = '';
    quotes.forEach(function(q) {
      html += '<div class="quote-card">';
      html += '<p class="quote-text">"' + q.text + '"</p>';
      html += '<p class="quote-author">- ' + q.author + '</p>';
      html += '</div>';
    });

    content.innerHTML = html;
  } catch (err) {
    content.innerHTML = '<p class="text-danger">error loading quotes</p>';
  }
}

// load quotes on page load
loadQuotes();
