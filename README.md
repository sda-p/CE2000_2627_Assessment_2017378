# Quote Cluster

A quote grouping web application built for the CE2000 Dynamic Web Technologies module.

## What it does

This application fetches quotes from an external API and displays them in a clean, modern interface. The main feature is the "Grouped" page, which attempts to group quotes by "semantic similarity" — although in practice this is implemented as a simple shared-word overlap algorithm rather than any actual natural language processing. This was a deliberate design decision: the initial ambitious approach of word-stem extraction and term-frequency vectorization proved too complex for the limited dataset available from the chosen API, so the implementation was simplified to something that actually works reliably.

## Features

- **Home page**: Displays a random selection of quotes fetched from the type.fit API, with color-coded card borders for visual variety
- **Quotes page**: Loads quotes from the dummyjson API with pagination via a floating "Load More" button. Newly loaded quotes are highlighted with orange borders and blinking arrows to distinguish them from previously loaded content. Clicking an author's name opens a Wikipedia lookup in a modal
- **Grouped Quotes page**: Displays quotes grouped by shared-word overlap (minimum 3 shared words to be grouped together). The grouping is performed client-side in the browser using the quotes stored in the shared localStorage store

## Technologies used

- **Front-end**: HTML5, CSS3, Bootstrap 5, JavaScript (ES6+), jQuery 3.7, SVG
- **Back-end**: Node.js, Express.js 4, EJS templating
- **APIs**: type.fit Quotes API (home page), dummyjson API (quotes page pagination), Wikipedia API (author lookups)
- **Storage**: localStorage for the shared quote store that persists across pages

## Setup

```bash
npm install
npm start
```

The server runs on port 9500 (configured for Codio deployment).

## API notes

The application uses three external APIs:

- **type.fit** (home page): Returns a small fixed set of quotes (approximately 5) with no pagination support. Returns the same quotes on every request.
- **dummyjson** (quotes page): Used for paginated quote loading. The quotes endpoint returns 30 quotes total with standard pagination parameters.
- **Wikipedia API** (author lookups): Used to fetch author biographies when a user clicks an author name. The app's Express server proxies requests to the Wikipedia API to avoid CORS issues.

The original plan was to use the Quotable API (api.quotable.io), but this service appears to be down (connections hang indefinitely). The zenquotes.io API was also tested but has aggressive rate limiting (returns 429 after approximately 5 requests). A local 100-quote JSON bank was used during development but was eventually replaced by the dummyjson API for the quotes page.

## Design decisions

- **Word-stem approach abandoned**: The initial implementation attempted to stem words by stripping common suffixes (-ing, -ed, -ly, etc.) and group quotes by stem frequency. This produced poor results as common English words dominated the stem frequency and unrelated quotes were grouped together.
- **Shared-word overlap**: The final approach counts shared words between quotes and groups quotes that share at least 3 words. This is simple but effective for demonstration purposes.
- **Client-side grouping**: Grouping is performed in the browser rather than on the server, using the shared quote store. This keeps the server simple and avoids the complexity of managing grouping state server-side.
- **localStorage quote store**: Quotes loaded on any page are saved to a shared localStorage store so they're available across the home, quotes, and grouped pages without refetching.

## Known limitations

- The type.fit API returns the same small set of quotes on each request
- The dummyjson API has a fixed set of 30 quotes with no search or filtering capabilities
- The grouping algorithm is simplistic (shared word count) and does not constitute true semantic similarity
- Wikipedia lookups depend on the author name matching a Wikipedia article; some authors may not have pages or may be ambiguous
- No user authentication or server-side state; the quote store relies on browser localStorage

## License

Built for academic purposes.

## Generative AI use

Tool name: Claude

Tool URL: https://claude.ai/

Summary of use: API discovery and format investigation

Date and the prompts you entered:
- What are some open access test APIs (no API key) I could use for a university project? I'm building an app that actually does something, so the APIs need to do more than just return success or such. [Date: 2026-09-23]
- What endpoints do they have and what do they expect? [Date: 2026-09-23]
- Those two quote APIs are kinda limited (one looks to be dead and the other always returns the same 5 quotes), are there any others I could use? Also include endpoints. [Date: 2026-11-27]
- Are there any other APIs I could use to add secondary functionality? I wrote a quote browser that sort of maybe kinda groups quotes by semantic similarity. [Date: 2026-11-27]

How you used the output: Discovery of candidate project APIs and their endpoint usage.
