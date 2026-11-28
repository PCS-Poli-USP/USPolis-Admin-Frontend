import { useCallback, useEffect, useRef } from 'react';
import useSearchService from '../API/services/useSearchService';
import { SearchClickSource } from '../../utils/enums/searchClickSource.enum';
import { SearchEntityType } from '../../utils/enums/searchEntityType.enum';
import { normalizeForSearch } from '../../utils/search/search.formatter';
import { SEARCH_MIN_QUERY_LENGTH } from './useGeneralSearch';

// How long the query must stay unchanged to count as the one the user
// settled on. The search itself fires after 300 ms; logging that would record
// every half-typed prefix ("cal", "calc", "calcu"...).
export const SEARCH_LOG_IDLE_MS = 2000;

interface UseSearchLogOptions {
  query: string;
  type?: SearchEntityType | null;
  idleMs?: number;
}

/**
 * Anonymous search log (POST /search/log), used to find what people look for
 * and do not find. A query is logged once, when it stays unchanged for
 * `idleMs` or when the user opens a result (`logNow`), whichever comes first.
 *
 * `logClick` records which result was opened (POST /search/click), the signal
 * the search learns from. It is separate from `logNow`: a result opened after
 * the query was already logged by the timer must still count. Each document
 * is sent once per query.
 *
 * Nothing about the user is sent; failures are ignored, logging must never
 * get in the way of searching.
 */
export function useSearchLog({
  query,
  type = null,
  idleMs = SEARCH_LOG_IDLE_MS,
}: UseSearchLogOptions) {
  const { log, click } = useSearchService();
  const lastLogged = useRef<string | null>(null);
  const clicked = useRef(new Set<string>());

  const settledQuery = useCallback(
    () => normalizeForSearch(query).trim().replace(/\s+/g, ' '),
    [query],
  );

  const logNow = useCallback(() => {
    const q = settledQuery();
    if (q.length < SEARCH_MIN_QUERY_LENGTH) return;
    const key = `${q}|${type ?? ''}`;
    if (key === lastLogged.current) return;
    lastLogged.current = key;
    log({ q, types: type ? [type] : undefined }).catch(() => {});
  }, [log, settledQuery, type]);

  const logClick = useCallback(
    (docKey: string, source: SearchClickSource) => {
      const q = settledQuery();
      if (q.length < SEARCH_MIN_QUERY_LENGTH) return;
      const key = `${q}|${type ?? ''}|${docKey}`;
      if (clicked.current.has(key)) return;
      clicked.current.add(key);
      click({
        q,
        types: type ? [type] : undefined,
        doc_key: docKey,
        source,
      }).catch(() => {});
    },
    [click, settledQuery, type],
  );

  useEffect(() => {
    const timer = setTimeout(logNow, idleMs);
    return () => clearTimeout(timer);
  }, [logNow, idleMs]);

  return { logNow, logClick };
}
