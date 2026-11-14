let loaded = 0;
let localQuotes = null;

async function getLocalQuotes() {
  if (!localQuotes) {
    const res = await fetch('/api/quotes/local');
    localQuotes = await res.json();
  }
  return localQuotes;
}

async function loadQuotes(append) {
  const content = document.getElementById('content');
  if (!append) {
    content.innerHTML = '<p class="text-muted">loading...</p>';
  } else {
    content.innerHTML += '<p class="text-muted">loading more...</p>';
  }

  try {
    const quotes = await getLocalQuotes();
    const batch = quotes.slice(loaded, loaded + 10);

    let html = '';
    batch.forEach(function(q) {
      html += '<div class="quote-card">';
      html += '<p class="quote-text">"' + q.text + '"</p>';
      html += '<p class="quote-author">- ' + q.author + '</p>';
      html += '</div>';
    });

    if (append) {
      content.innerHTML = content.innerHTML.replace('<p class="text-muted">loading more...</p>', html);
    } else {
      content.innerHTML = html;
    }
    loaded += batch.length;
  } catch (err) {
    content.innerHTML = '<p class="text-danger">error loading quotes</p>';
  }
}

document.getElementById('load-more').addEventListener('click', function() {
  loadQuotes(true);
});

loadQuotes(false);
