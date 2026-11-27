# Quote Cluster

A quote grouping web application built for the CE2000 Dynamic Web Technologies module.

## What it does

This application fetches quotes from an external API and displays them in a clean, modern interface. The main feature is the "Grouped" page, which attempts to group quotes by "semantic similarity" — although in practice this is implemented as a simple shared-word overlap algorithm rather than any actual natural language processing. This was a deliberate design decision: the initial ambitious approach of word-stem extraction and term-frequency vectorization proved too complex for the limited dataset available from the chosen API, so the implementation was simplified to something that actually works reliably.

## Features

- **Home page**: Displays a random selection of quotes fetched from the type.fit API, with color-coded card borders for visual variety
- **Quotes page**: Loads quotes from a local 100-quote bank with a floating "Load More" button that dynamically loads additional quotes without a page refresh. Newly loaded quotes are highlighted with orange borders and blinking arrows to distinguish them from previously loaded content
- **Grouped Quotes page**: Displays quotes grouped by shared-word overlap (minimum 3 shared words to be grouped together). The grouping is performed server-side

## Technologies used

- **Front-end**: HTML5, CSS3, Bootstrap 5, JavaScript (ES6+), jQuery 3.7, SVG
- **Back-end**: Node.js, Express.js 4, EJS templating
- **API**: type.fit Quotes API (https://type.fit/api/quotes) for live data
- **Local data**: 100-quote JSON bank for fallback and demonstration purposes

## Setup

```bash
npm install
npm start
```

The server runs on port 9500 (configured for Codio deployment).

## API notes

The type.fit API is used as the primary live data source for the home page. It returns a small fixed set of quotes (approximately 5) with no pagination support. For the Quotes and Grouped pages, a local 100-quote bank is used instead, which provides a more robust demonstration of the application's features.

The original plan was to use the Quotable API (api.quotable.io), but this service appears to be down (connections hang indefinitely). The zenquotes.io API was also tested but has aggressive rate limiting (returns 429 after approximately 5 requests).

## Design decisions

- **Word-stem approach abandoned**: The initial implementation attempted to stem words by stripping common suffixes (-ing, -ed, -ly, etc.) and group quotes by stem frequency. This produced poor results as common English words dominated the stem frequency and unrelated quotes were grouped together.
- **Shared-word overlap**: The final approach counts shared words between quotes and groups quotes that share at least 3 words. This is simple but effective for demonstration purposes.
- **Local quote bank**: A 100-quote JSON file is used for the Quotes and Grouped pages to ensure reliable demonstration of the application's features regardless of external API availability.

## Known limitations

- The type.fit API returns the same small set of quotes on each request
- The grouping algorithm is simplistic (shared word count) and does not constitute true semantic similarity
- No user authentication or persistent state
- Limited to Chromium browsers for guaranteed compatibility

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
