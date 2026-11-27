// grouped page - shows quotes grouped by "semantic similarity"
// (which is really just shared word overlap, not actual nlp)

// escape html entities to prevent injection from api data
function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// show author info in a modal
function showAuthorModal(author) {
  $('#authorModalBody').html('<p class="text-muted">loading...</p>');
  
  const modal = new bootstrap.Modal($('#authorModal')[0]);
  modal.show();
  
  // fetch from our backend which proxies to wikipedia
  $.ajax({
    url: '/api/wiki/summary/' + encodeURIComponent(author),
    success: function(data) {
      let html = '';
      
      // show disambiguation notice if needed
      if (data.type === 'disambiguation') {
        html += '<p class="text-muted small"><em>multiple people share this name</em></p>';
      }
      
      // show thumbnail if available
      if (data.thumbnail && data.thumbnail.source) {
        html += '<img src="' + esc(data.thumbnail.source) + '" alt="' + esc(data.title) + '" class="mb-2" style="max-width: 200px;">';
      }
      
      // show description
      if (data.description) {
        html += '<p class="fw-bold">' + esc(data.description) + '</p>';
      }
      
      // show extract (summary)
      if (data.extract) {
        html += '<p class="small">' + esc(data.extract) + '</p>';
      }
      
      // link to full article
      if (data.content_urls && data.content_urls.desktop) {
        html += '<a href="' + esc(data.content_urls.desktop.page) + '" target="_blank" class="btn btn-sm btn-primary">read more on wikipedia</a>';
      }
      
      // set modal title
      $('#authorModalLabel').text(data.title);
      
      $('#authorModalBody').html(html);
    },
    error: function(xhr) {
      // 404 means no wikipedia page, anything else is a real error
      if (xhr.status === 404) {
        $('#authorModalBody').html('<p class="text-muted">no wikipedia page found for ' + esc(author) + '</p>');
      } else {
        $('#authorModalBody').html('<p class="text-danger">error loading author info</p>');
      }
    }
  });
}

// load the grouped quotes from the api and render them
function loadGroupedQuotes() {
  $('#content').html('<p class="text-muted">loading and grouping quotes...</p>');

  $.ajax({
    url: '/api/quotes/grouped',
    success: function(groups) {
      let html = '';
      groups.forEach(function(group, idx) {
        html += '<div class="group-container">';
        html += '<h5 class="group-title">Group ' + (idx + 1) + ' (' + group.quotes.length + ' quotes)</h5>';
        group.quotes.forEach(function(q) {
          html += '<div class="quote-card">';
          html += '<p class="quote-text">"' + esc(q.text) + '"</p>';
          html += '<p class="quote-author">- <span class="author-link" data-author="' + esc(q.author) + '">' + esc(q.author) + '</span></p>';
          html += '</div>';
        });
        html += '</div>';
      });
      $('#content').html(html);
    },
    error: function() {
      $('#content').html('<p class="text-danger">error loading quotes</p>');
    }
  });
}

// use event delegation because the cards are added dynamically
$('#content').on('click', '.author-link', function() {
  const author = $(this).data('author');
  showAuthorModal(author);
});

// load the groups when the page loads
loadGroupedQuotes();
