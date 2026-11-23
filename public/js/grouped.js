// grouped page - shows quotes grouped by "semantic similarity"
// (which is really just shared word overlap, not actual nlp)

// load the grouped quotes from the api and render them
async function loadGroupedQuotes() {
  const content = document.getElementById('content');
  content.innerHTML = '<p class="text-muted">loading and grouping quotes...</p>';

  try {
    const res = await fetch('/api/quotes/grouped');
    const groups = await res.json();

    let html = '';
    groups.forEach(function(group, idx) {
      html += '<div class="group-container">';
      html += '<h5 class="group-title">Group ' + (idx + 1) + ' (' + group.quotes.length + ' quotes)</h5>';
      group.quotes.forEach(function(q) {
        html += '<div class="quote-card">';
        html += '<p class="quote-text">"' + q.text + '"</p>';
        html += '<p class="quote-author">- ' + q.author + '</p>';
        html += '</div>';
      });
      html += '</div>';
    });

    content.innerHTML = html;
  } catch (err) {
    content.innerHTML = '<p class="text-danger">error loading quotes</p>';
  }
}

// load the groups when the page loads
loadGroupedQuotes();
