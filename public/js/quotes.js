let loaded = 0;
let localQuotes = null;
let newCardTimers = [];

async function getLocalQuotes() {
  if (!localQuotes) {
    const res = await fetch('/api/quotes/local');
    localQuotes = await res.json();
  }
  return localQuotes;
}

// create a little svg arrow
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

// toggle arrow visibility in a loop
function startArrowBlinking(arrow) {
  let visible = true;
  const timer = setInterval(function() {
    visible = !visible;
    arrow.style.display = visible ? 'block' : 'none';
  }, 1000);
  newCardTimers.push(timer);
}

async function loadQuotes(append) {
  const content = document.getElementById('content');
  if (!append) {
    content.innerHTML = '<p class="text-muted">loading...</p>';
  } else {
    content.innerHTML = '<p class="text-muted">loading more...</p>' + content.innerHTML;
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

    content.innerHTML = content.innerHTML.replace('<p class="text-muted">loading more...</p>', html);

    // add blinking arrows to new cards
    if (append) {
      const arrowSlots = content.querySelectorAll('.arrow-slot');
      arrowSlots.forEach(function(slot) {
        const arrow = makeArrow();
        slot.appendChild(arrow);
        startArrowBlinking(arrow);
      });
    }

    loaded += batch.length;

    // scroll to top so new quotes are visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    content.innerHTML = '<p class="text-danger">error loading quotes</p>';
  }
}

document.getElementById('load-more').addEventListener('click', function() {
  loadQuotes(true);
});

loadQuotes(false);
