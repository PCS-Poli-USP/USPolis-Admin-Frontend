import { SearchClickSource } from '../../../utils/enums/searchClickSource.enum';
import { SearchEntityType } from '../../../utils/enums/searchEntityType.enum';

// GET /search
export interface SearchParams {
  q: string;
  types?: SearchEntityType[];
  // Results per type (1..20, backend default 5)
  limit?: number;
  // Related documents per type of the top result (0..20, backend default 6)
  related_limit?: number;
}

// POST /search/log: a search the user settled on. The server normalizes the
// query and counts the results itself.
export interface SearchLogRequest {
  q: string;
  types?: SearchEntityType[];
}

// POST /search/click: a result opened from a search. The server checks the
// document is among the results of `q` and computes its position.
export interface SearchClickRequest {
  q: string;
  types?: SearchEntityType[];
  doc_key: string;
  source: SearchClickSource;
}

// GET /admin/search-logs/summary
export interface SearchLogSummaryParams {
  // Window in days (1..SEARCH_LOG_RETENTION_DAYS, backend default 30)
  days?: number;
  // Only queries that returned nothing at least once
  only_empty?: boolean;
  // Only queries that found something but whose results nobody opened
  only_unclicked?: boolean;
  // Queries in the list (1..500, backend default 50)
  limit?: number;
}

export enum SearchDocumentSort {
  CLICKS = 'clicks',
  TRENDING = 'trending',
}

// GET /admin/search-logs/documents
export interface SearchDocumentSummaryParams {
  // Window in days (backend default 30)
  days?: number;
  // Most opened first, or rising the most
  sort?: SearchDocumentSort;
  // Documents in the list (1..500, backend default 50)
  limit?: number;
}
