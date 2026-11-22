import axios from 'axios';
import { useEffect, useState } from 'react';
import useSearchService from '../API/services/useSearchService';
import {
  SearchResponse,
  SearchTopResponse,
} from '../../models/http/responses/search.response.models';
import { SearchEntityType } from '../../utils/enums/searchEntityType.enum';

export const SEARCH_MIN_QUERY_LENGTH = 2;
export const SEARCH_DEBOUNCE_MS = 300;

interface UseGeneralSearchOptions {
  query: string;
  type?: SearchEntityType | null;
  // Results per type; a single selected type gets more room.
  limit?: number;
  debounceMs?: number;
}

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
}

// Result of the last finished request, tagged with the key it answers.
// Loading is derived (the current key has no result yet) instead of being
// set inside the effect, so the effect only sets state from async callbacks.
interface Settled<T> {
  key: string;
  data: T | null;
  error: boolean;
}

/**
 * Debounced GET /search. Each new query aborts the request in flight, so
 * typing never piles up requests against the per-IP rate limit, and a slow
 * old response can never overwrite a newer one. While a new query loads, the
 * previous results stay on screen.
 */
export function useGeneralSearch({
  query,
  type = null,
  limit,
  debounceMs = SEARCH_DEBOUNCE_MS,
}: UseGeneralSearchOptions): AsyncState<SearchResponse> {
  const service = useSearchService();
  const [settled, setSettled] = useState<Settled<SearchResponse> | null>(null);
  const q = query.trim();
  const key =
    q.length >= SEARCH_MIN_QUERY_LENGTH
      ? JSON.stringify([q, type, limit])
      : null;

  useEffect(() => {
    if (key === null) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      service
        .search(
          { q, types: type ? [type] : undefined, limit },
          controller.signal,
        )
        .then((response) =>
          setSettled({ key, data: response.data, error: false }),
        )
        .catch((error) => {
          if (axios.isCancel(error)) return;
          setSettled({ key, data: null, error: true });
        });
    }, debounceMs);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [key, q, type, limit, debounceMs, service]);

  if (key === null) return { data: null, loading: false, error: false };
  const isCurrent = settled?.key === key;
  return {
    data: settled?.data ?? null,
    loading: !isCurrent,
    error: isCurrent && settled.error,
  };
}

/** GET /search/documents/{docKey}: the document the user clicked, with its
 * related documents. Does nothing while `docKey` is null. */
export function useSearchDocument(
  docKey: string | null,
): AsyncState<SearchTopResponse> {
  const service = useSearchService();
  const [settled, setSettled] = useState<Settled<SearchTopResponse> | null>(
    null,
  );

  useEffect(() => {
    if (docKey === null) return;
    const controller = new AbortController();
    service
      .getDocument(docKey, undefined, controller.signal)
      .then((response) =>
        setSettled({ key: docKey, data: response.data, error: false }),
      )
      .catch((error) => {
        if (axios.isCancel(error)) return;
        setSettled({ key: docKey, data: null, error: true });
      });
    return () => controller.abort();
  }, [docKey, service]);

  if (docKey === null) return { data: null, loading: false, error: false };
  const isCurrent = settled?.key === docKey;
  return {
    // Unlike the search, never show another document while this one loads.
    data: isCurrent ? settled.data : null,
    loading: !isCurrent,
    error: isCurrent && settled.error,
  };
}
