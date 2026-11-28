import { SearchEntityType } from '../../../utils/enums/searchEntityType.enum';
import { WeekDay } from '../../../utils/enums/weekDays.enum';

// Payloads mirror the jsonb built by the search_document materialized view
// (backend migration 5c8e1f2a9b47).

export interface SearchClassSchedule {
  week_day: WeekDay | null;
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  classroom: string | null;
  building: string | null;
}

export interface SearchClassPayload {
  code: string;
  subject_id: number;
  subject_code: string;
  subject_name: string;
  professors: string[];
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  schedules: SearchClassSchedule[];
}

export interface SearchSubjectPayload {
  code: string;
  name: string;
  professors: string[];
  class_count: number;
}

export interface SearchClassroomPayload {
  name: string;
  building_id: number;
  building: string;
  floor: number;
  capacity: number;
  accessibility: boolean;
  air_conditioning: boolean;
}

export interface SearchBuildingPayload {
  name: string;
  classroom_count: number;
}

export interface SearchProfessorPayload {
  name: string;
  class_count: number;
  subject_count: number;
}

export interface SearchReservationOccurrence {
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
}

// Exams, events and monitoria meetings share one payload shape.
export interface SearchReservationPayload {
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  week_day: WeekDay | null;
  recurrence: string | null; // daily | weekly | monthly | custom
  classroom_id: number | null;
  classroom: string | null;
  building_id: number | null;
  building: string | null;
  event_type: string | null; // talk | workshop | selection_process | other
  link: string | null; // events only
  // Exam subject, or subjects whose code appears in the title
  subjects: Array<{ id: number; code: string; name: string }>;
  // Actual dates, sorted (most reservations use a custom recurrence)
  occurrences: SearchReservationOccurrence[];
}

interface SearchItemBase<T extends SearchEntityType, P> {
  // Unique across types: "<type>:<entity_id>" (entity_id alone is not)
  doc_key: string;
  type: T;
  entity_id: string;
  title: string;
  subtitle: string | null;
  score: number;
  payload: P;
  // Matches only some of the query words (see SearchResponse.partial)
  partial: boolean;
}

export type SearchItemResponse =
  | SearchItemBase<SearchEntityType.SUBJECT, SearchSubjectPayload>
  | SearchItemBase<SearchEntityType.CLASS, SearchClassPayload>
  | SearchItemBase<SearchEntityType.CLASSROOM, SearchClassroomPayload>
  | SearchItemBase<SearchEntityType.BUILDING, SearchBuildingPayload>
  | SearchItemBase<SearchEntityType.PROFESSOR, SearchProfessorPayload>
  | SearchItemBase<SearchEntityType.EXAM, SearchReservationPayload>
  | SearchItemBase<SearchEntityType.EVENT, SearchReservationPayload>
  | SearchItemBase<SearchEntityType.MEETING, SearchReservationPayload>;

export interface SearchGroupResponse {
  type: SearchEntityType;
  total: number;
  items: SearchItemResponse[];
}

export type SearchTopResponse = SearchItemResponse & {
  related: SearchGroupResponse[];
};

export interface SearchResponse {
  query: string;
  top: SearchTopResponse | null;
  groups: SearchGroupResponse[];
  // No result has every word of the query: these are the ones with the most
  // words (never mixed with complete ones).
  partial: boolean;
  // Types named in the query ("professor levy" -> professor): ranked first,
  // but not a filter.
  intent_types: SearchEntityType[];
}

// GET /admin/search-logs/summary: one row per normalized query.
export interface SearchQueryStatResponse {
  query: string;
  searches: number;
  // Searches of this query that returned nothing
  empty_searches: number;
  last_result_count: number;
  last_searched_at: string;
  // Results opened from this query
  clicks: number;
}

export interface SearchLogSummaryResponse {
  since_days: number;
  total_searches: number;
  distinct_queries: number;
  empty_searches: number;
  // Distinct queries with at least one result opened
  clicked_queries: number;
  queries: SearchQueryStatResponse[];
}

// GET /admin/search-logs/documents: one row per opened document.
export interface SearchDocumentStatResponse {
  doc_key: string;
  // null when the document is no longer in the index
  type: SearchEntityType | null;
  title: string | null;
  impressions: number;
  clicks: number;
  // clicks / impressions; null without impressions (opened only from the
  // highlight panel)
  ctr: number | null;
  // Recent clicks over the long-term rate (> 1: rising)
  trend: number | null;
}

export interface SearchPositionStatResponse {
  position: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
}

export interface SearchDocumentSummaryResponse {
  since_days: number;
  impressions: number;
  clicks: number;
  // Documents opened at least once
  distinct_documents: number;
  // Average 1-based position of the opened results (lower is better)
  mean_click_position: number | null;
  positions: SearchPositionStatResponse[];
  documents: SearchDocumentStatResponse[];
}
