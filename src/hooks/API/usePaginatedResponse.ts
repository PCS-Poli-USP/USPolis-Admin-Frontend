import { useState } from 'react';
import { PaginatedResponse } from '../../models/http/responses/paginated.response.models';

export function usePaginatedResponse<T>() {
  const EMPTY_PAGINATED_RESPONSE: PaginatedResponse<T> = {
    page: 0,
    page_size: 0,
    total_items: 0,
    total_pages: 0,
    data: [],
  };
  const [pageResponse, setPageResponse] = useState<PaginatedResponse<T>>(
    EMPTY_PAGINATED_RESPONSE,
  );

  return {
    pageResponse,
    setPageResponse,
  };
}
