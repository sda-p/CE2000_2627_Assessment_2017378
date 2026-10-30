let loaded = 0;

async function loadQuotes(append) {
  const content = document.getElementById('content');
  if (!append) {
    content.innerHTML = '<p class="text-muted">loading...</p>';
  } else {
    content.innerHTML += '<p class="text-muted">loading more...</p>';
  }

  try {
    const res = await fetch('/api/quotes/random?limit=10');
    const quotes = await res.json();

    let html = '';
    quotes.forEach(function(q) {
      html += '<div class="quote-card">';
      html += '<p class="quote-text">"' + q.text + '"</p>';
      html += '<p class="quote-author">- ' + q.author + '</p>';
      html += '</div>';
    });

    if (append) {
      // remove the "loading more" message and append new quotes
      content.innerHTML = content.innerHTML.replace('<p class="text-muted">loading more...</p>', html);
    } else {
      content.innerHTML = html;
    }
    loaded += quotes.length;
  } catch (err) {
    content.innerHTML = '<p class="text-danger">error loading quotes</p>';
  }
}

document.getElementById('load-more').addEventListener('click', function() {
  loadQuotes(true);
});

loadQuotes(false);
