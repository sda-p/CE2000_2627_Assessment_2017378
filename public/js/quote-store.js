// shared quote store - keeps track of all quotes we've fetched across pages
// uses localStorage so it persists between page navigations

const QuoteStore = {
  STORAGE_KEY: 'quote-cluster-quotes',

  // get all stored quotes
  getQuotes: function() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('error reading quote store:', e);
    }
    return [];
  },

  // save quotes to the store (deduplicates by text)
  saveQuotes: function(newQuotes) {
    try {
      const existing = this.getQuotes();
      const existingTexts = new Set(existing.map(function(q) { return q.text; }));

      newQuotes.forEach(function(q) {
        if (!existingTexts.has(q.text)) {
          existing.push(q);
          existingTexts.add(q.text);
        }
      });

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error('error saving quote store:', e);
    }
  },

  // get count of stored quotes
  count: function() {
    return this.getQuotes().length;
  }
};
