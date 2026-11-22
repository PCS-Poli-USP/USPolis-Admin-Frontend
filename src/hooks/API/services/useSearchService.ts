import { AxiosResponse } from 'axios';
import { useMemo } from 'react';
import axios from '../../../services/api/axios';
import {
  SearchLogRequest,
  SearchParams,
} from '../../../models/http/requests/search.request.models';
import {
  SearchResponse,
  SearchTopResponse,
} from '../../../models/http/responses/search.response.models';

// Public endpoints: plain axios instance, no session needed.
const useSearchService = () => {
  return useMemo(() => {
    const search = (
      params: SearchParams,
      signal?: AbortSignal,
    ): Promise<AxiosResponse<SearchResponse>> => {
      return axios.get('/search', {
        params,
        signal,
        // FastAPI expects repeated keys (types=a&types=b), not types[]=a
        paramsSerializer: { indexes: null },
      });
    };

    const getDocument = (
      docKey: string,
      relatedLimit?: number,
      signal?: AbortSignal,
    ): Promise<AxiosResponse<SearchTopResponse>> => {
      return axios.get(`/search/documents/${encodeURIComponent(docKey)}`, {
        params: { related_limit: relatedLimit },
        signal,
      });
    };

    const log = (body: SearchLogRequest): Promise<AxiosResponse<void>> => {
      return axios.post('/search/log', body);
    };

    return { search, getDocument, log };
  }, []);
};

export default useSearchService;
