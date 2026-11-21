// quotes page - loads from local bank and handles the load more button
let loaded = 0; // how many quotes we've shown so far
let localQuotes = null; // cached copy of the full quote list
let newCardTimers = []; // keep track of the arrow blink timers

// fetch the local quotes once and cache them
function getLocalQuotes() {
  return new Promise(function(resolve, reject) {
    if (localQuotes) {
      resolve(localQuotes);
    } else {
      $.ajax({
        url: '/api/quotes/local',
        success: function(data) {
          localQuotes = data;
          resolve(data);
        },
        error: function() {
          reject('failed to load quotes');
        }
      });
    }
  });
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

async function loadQuotes(append) {
  const $content = $('#content');
  if (!append) {
    $content.html('<p class="text-muted loading-more">loading...</p>');
  } else {
    $content.prepend('<p class="text-muted loading-more">loading more...</p>');
  }

  try {
    const quotes = await getLocalQuotes();
    const batch = quotes.slice(loaded, loaded + 5);

    let html = '';
    batch.forEach(function(q) {
      const cardClass = append ? 'quote-card new-quote' : 'quote-card';
      html += '<div class="' + cardClass + '">';
      if (append) {
        html += '<span class="arrow-slot"></span>';
      }
      html += '<p class="quote-text">"' + q.text + '"</p>';
      html += '<p class="quote-author">- ' + q.author + '</p>';
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

    loaded += batch.length;

    // scroll back to top so the new quotes are visible
    $('html, body').animate({ scrollTop: 0 }, 400);
  } catch (err) {
    $content.html('<p class="text-danger">error loading quotes</p>');
  }
}

$('#load-more').on('click', function() {
  loadQuotes(true);
});

loadQuotes(false);
