// main app js - handles the home page
console.log('app loaded');

// colors for the card borders - cycles through them
const cardColors = ['#0d6efd', '#198754', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14'];

// show author info in a modal
function showAuthorModal(author) {
  const modalBody = document.getElementById('authorModalBody');
  modalBody.innerHTML = '<p class="text-muted">loading...</p>';
  
  const modal = new bootstrap.Modal(document.getElementById('authorModal'));
  modal.show();
  
  // fetch from our backend which proxies to wikipedia
  fetch('/api/wiki/summary/' + author)
    .then(function(res) {
      if (res.status === 404) {
        modalBody.innerHTML = '<p class="text-muted">no wikipedia page found for ' + author + '</p>';
        return null;
      }
      return res.json();
    })
    .then(function(data) {
      if (!data) return;
      
      let html = '';
      
      // show disambiguation notice if needed
      if (data.type === 'disambiguation') {
        html += '<p class="text-muted small"><em>multiple people share this name</em></p>';
      }
      
      // show thumbnail if available
      if (data.thumbnail && data.thumbnail.source) {
        html += '<img src="' + data.thumbnail.source + '" alt="' + data.title + '" class="mb-2" style="max-width: 200px;">';
      }
      
      // show description
      if (data.description) {
        html += '<p class="fw-bold">' + data.description + '</p>';
      }
      
      // show extract (summary)
      if (data.extract) {
        html += '<p class="small">' + data.extract + '</p>';
      }
      
      // link to full article
      if (data.content_urls && data.content_urls.desktop) {
        html += '<a href="' + data.content_urls.desktop.page + '" target="_blank" class="btn btn-sm btn-primary">read more on wikipedia</a>';
      }
      
      // set modal title
      document.getElementById('authorModalLabel').textContent = data.title;
      
      modalBody.innerHTML = html;
    })
    .catch(function(err) {
      modalBody.innerHTML = '<p class="text-danger">error loading author info</p>';
    });
}

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
      html += '<p class="quote-author">- <span class="author-link" data-author="' + q.author + '">' + q.author + '</span></p>';
      html += '</div>';
    });

    content.innerHTML = html;
  } catch (err) {
    content.innerHTML = '<p class="text-danger">error loading quotes</p>';
  }
}

// use event delegation because the cards are added dynamically
document.getElementById('content').addEventListener('click', function(e) {
  const target = e.target.closest('.author-link');
  if (target) {
    const author = target.dataset.author;
    showAuthorModal(author);
  }
});

// load quotes when the page loads
loadQuotes();
