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

// GET /admin/search-logs/summary
export interface SearchLogSummaryParams {
  // Window in days (1..SEARCH_LOG_RETENTION_DAYS, backend default 30)
  days?: number;
  // Only queries that returned nothing at least once
  only_empty?: boolean;
  // Queries in the list (1..500, backend default 50)
  limit?: number;
}
