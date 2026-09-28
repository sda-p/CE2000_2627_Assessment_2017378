async function loadGroupedQuotes() {
  const content = document.getElementById('content');
  content.innerHTML = '<p class="text-muted">loading and grouping quotes...</p>';

  try {
    const res = await fetch('/api/quotes/grouped');
    const groups = await res.json();

    let html = '';
    groups.forEach(function(group) {
      html += '<div class="mb-4">';
      html += '<h5 class="text-primary">#' + group.tag + '</h5>';
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
