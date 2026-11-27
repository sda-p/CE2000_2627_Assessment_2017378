// quotes page - loads from dummyjson api with pagination
let loaded = 0; // how many quotes we've shown so far
let totalQuotes = null; // will be set from the api response
let newCardTimers = []; // keep track of the arrow blink timers
let storedQuotes = []; // quotes from the shared store

// escape html entities to prevent injection from api data
function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

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

// clear all the old arrow timers and reset the "new" state
function clearNewState() {
  // stop all the blink timers
  newCardTimers.forEach(function(t) { clearInterval(t); });
  newCardTimers = [];
  
  // remove the new-quote class and arrows from all cards
  $('.quote-card').removeClass('new-quote');
  $('.arrow-slot').remove();
}

// show author info in a modal
function showAuthorModal(author) {
  const modalBody = document.getElementById('authorModalBody');
  modalBody.innerHTML = '<p class="text-muted">loading...</p>';
  
  const modal = new bootstrap.Modal(document.getElementById('authorModal'));
  modal.show();
  
  // fetch from our backend which proxies to wikipedia
  fetch('/api/wiki/summary/' + encodeURIComponent(author))
    .then(function(res) {
      if (res.status === 404) {
        modalBody.innerHTML = '<p class="text-muted">no wikipedia page found for ' + esc(author) + '</p>';
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
      document.getElementById('authorModalLabel').textContent = data.title;
      
      modalBody.innerHTML = html;
    })
    .catch(function(err) {
      modalBody.innerHTML = '<p class="text-danger">error loading author info</p>';
    });
}

// render a batch of quotes to the content area
function renderQuotes(quotes, append) {
  const $content = $('#content');
  
  let html = '';
  quotes.forEach(function(q) {
    const cardClass = append ? 'quote-card new-quote' : 'quote-card';
    html += '<div class="' + cardClass + '">';
    if (append) {
      html += '<span class="arrow-slot"></span>';
    }
    html += '<p class="quote-text">"' + esc(q.text) + '"</p>';
    html += '<p class="quote-author">- <span class="author-link" data-author="' + esc(q.author) + '">' + esc(q.author) + '</span></p>';
    html += '</div>';
  });

  const $newCards = $(html);
  if (!append) {
    $content.html($newCards);
  } else {
    $content.prepend($newCards);
  }
  
  // add blinking arrows to new cards only
  if (append) {
    $newCards.find('.arrow-slot').each(function() {
      const slot = $(this);
      const arrow = makeArrow();
      slot.append(arrow);
      startArrowBlinking(arrow);
    });
  }
}

async function loadQuotes(append) {
  const $content = $('#content');
  
  // if this is the first load and we have stored quotes, show those first
  if (!append && storedQuotes.length > 0 && loaded === 0) {
    renderQuotes(storedQuotes.slice(0, 5), false);
    loaded = Math.min(5, storedQuotes.length);
    return;
  }
  
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

    // save quotes to the shared store
    QuoteStore.saveQuotes(data.quotes);
    
    renderQuotes(data.quotes, append);
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

// load stored quotes on page load
storedQuotes = QuoteStore.getQuotes();

$('#load-more').on('click', function() {
  loadQuotes(true);
});

loadQuotes(false);
