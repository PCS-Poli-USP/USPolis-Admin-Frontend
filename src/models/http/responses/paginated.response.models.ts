export interface PaginatedResponse<T> {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  data: T[];
}
