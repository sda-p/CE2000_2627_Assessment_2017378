// quotes page - loads from dummyjson api with pagination
let loaded = 0; // how many quotes we've shown so far
let totalQuotes = null; // will be set from the api response
let newCardTimers = []; // keep track of the arrow blink timers

// create a little svg arrow to show which quotes are new
function makeArrow() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.classList.add('new-quote-arrow');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M4 4l8 4-8 4V4z');
  path.setAttribute('fill', '#fd7e14');
  svg.appendChild(path);

  return svg;
}

// toggle arrow visibility in a loop (using js instead of css animation because the brief asked for dom manipulation)
function startArrowBlinking(arrow) {
  let visible = true;
  const timer = setInterval(function() {
    visible = !visible;
    arrow.style.display = visible ? 'block' : 'none';
  }, 1000);
  newCardTimers.push(timer);
}

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

async function loadQuotes(append) {
  const $content = $('#content');
  if (!append) {
    $content.html('<p class="text-muted loading-more">loading...</p>');
  } else {
    $content.prepend('<p class="text-muted loading-more">loading more...</p>');
  }

  try {
    // figure out which page we want based on how many we've loaded
    const page = Math.floor(loaded / 5) + 1;
    const res = await fetch('/api/quotes/page?page=' + page);
    const data = await res.json();

    if (totalQuotes === null) {
      totalQuotes = data.total;
    }

    let html = '';
    data.quotes.forEach(function(q) {
      const cardClass = append ? 'quote-card new-quote' : 'quote-card';
      html += '<div class="' + cardClass + '">';
      if (append) {
        html += '<span class="arrow-slot"></span>';
      }
      html += '<p class="quote-text">"' + q.text + '"</p>';
      html += '<p class="quote-author">- <span class="author-link" data-author="' + q.author + '">' + q.author + '</span></p>';
      html += '</div>';
    });

    $('.loading-more').replaceWith(html);

    // add blinking arrows to new cards
    if (append) {
      $('.arrow-slot').each(function() {
        const slot = $(this);
        const arrow = makeArrow();
        slot.append(arrow);
        startArrowBlinking(arrow);
      });
    }

    loaded += data.quotes.length;

    // if we've loaded all quotes, disable the button
    if (loaded >= totalQuotes) {
      $('#load-more').text('No more quotes').prop('disabled', true);
    }

    // scroll back to top so the new quotes are visible
    $('html, body').animate({ scrollTop: 0 }, 400);
  } catch (err) {
    $content.html('<p class="text-danger">error loading quotes</p>');
  }
}

// use event delegation because the cards are added dynamically
$('#content').on('click', '.author-link', function() {
  const author = $(this).data('author');
  showAuthorModal(author);
});

$('#load-more').on('click', function() {
  loadQuotes(true);
});

loadQuotes(false);
