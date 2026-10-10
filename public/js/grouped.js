async function loadGroupedQuotes() {
  const content = document.getElementById('content');
  content.innerHTML = '<p class="text-muted">loading and grouping quotes...</p>';

  try {
    const res = await fetch('/api/quotes/grouped');
    const groups = await res.json();

    let html = '';
    groups.forEach(function(group, idx) {
      html += '<div class="mb-4 p-3" style="background: #e9ecef; border-radius: 8px;">';
      html += '<h5 class="text-primary mb-3">Group ' + (idx + 1) + ' (' + group.quotes.length + ' quotes)</h5>';
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

loadGroupedQuotes();
