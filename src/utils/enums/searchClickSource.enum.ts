// Mirrors SearchClickSource (backend): where a search result was opened from.
export enum SearchClickSource {
  // A result of the list (the server computes its position)
  RESULT = 'result',
  // A document of the highlight panel (no position)
  RELATED = 'related',
}
