import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchClickSource } from '../../utils/enums/searchClickSource.enum';
import { SearchEntityType } from '../../utils/enums/searchEntityType.enum';
import { SEARCH_LOG_IDLE_MS, useSearchLog } from './useSearchLog';

const service = { log: vi.fn(), click: vi.fn() };
vi.mock('../API/services/useSearchService', () => ({
  default: () => service,
}));

type Props = { query: string; type?: SearchEntityType | null };

function setup(initial: Props) {
  return renderHook((props: Props) => useSearchLog(props), {
    initialProps: initial,
  });
}

describe('useSearchLog', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    service.log.mockReset().mockResolvedValue({});
    service.click.mockReset().mockResolvedValue({});
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('loga só a consulta final, depois que ela fica parada', () => {
    const { rerender } = setup({ query: 'cal' });
    act(() => vi.advanceTimersByTime(500));
    rerender({ query: 'calcu' });
    act(() => vi.advanceTimersByTime(500));
    rerender({ query: 'Cálculo  I' });
    expect(service.log).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(SEARCH_LOG_IDLE_MS));

    expect(service.log).toHaveBeenCalledTimes(1);
    expect(service.log).toHaveBeenCalledWith({
      q: 'calculo i',
      types: undefined,
    });
  });

  it('logNow loga na hora e não repete a mesma consulta', () => {
    const { result } = setup({
      query: 'biênio',
      type: SearchEntityType.BUILDING,
    });

    act(() => result.current.logNow());
    act(() => vi.advanceTimersByTime(SEARCH_LOG_IDLE_MS));
    act(() => result.current.logNow());

    expect(service.log).toHaveBeenCalledTimes(1);
    expect(service.log).toHaveBeenCalledWith({
      q: 'bienio',
      types: [SearchEntityType.BUILDING],
    });
  });

  it('outro filtro de tipo conta como outra busca', () => {
    const { rerender } = setup({ query: 'b2' });
    act(() => vi.advanceTimersByTime(SEARCH_LOG_IDLE_MS));
    rerender({ query: 'b2', type: SearchEntityType.CLASSROOM });
    act(() => vi.advanceTimersByTime(SEARCH_LOG_IDLE_MS));

    expect(service.log).toHaveBeenCalledTimes(2);
  });

  it('ignora consultas curtas demais', () => {
    setup({ query: ' a ' });
    act(() => vi.advanceTimersByTime(SEARCH_LOG_IDLE_MS));

    expect(service.log).not.toHaveBeenCalled();
  });

  it('falha no envio não quebra nada', async () => {
    service.log.mockRejectedValue(new Error('Network Error'));
    setup({ query: 'calculo' });

    await act(async () => {
      vi.advanceTimersByTime(SEARCH_LOG_IDLE_MS);
    });

    expect(service.log).toHaveBeenCalledTimes(1);
  });

  it('logClick manda o documento aberto mesmo depois de a consulta ter sido logada', () => {
    const { result } = setup({ query: 'Cálculo', type: null });
    act(() => vi.advanceTimersByTime(SEARCH_LOG_IDLE_MS));
    expect(service.log).toHaveBeenCalledTimes(1);

    act(() => result.current.logClick('subject:7', SearchClickSource.RESULT));

    expect(service.click).toHaveBeenCalledWith({
      q: 'calculo',
      types: undefined,
      doc_key: 'subject:7',
      source: SearchClickSource.RESULT,
    });
  });

  it('logClick não repete o mesmo documento na mesma consulta', () => {
    const { result, rerender } = setup({ query: 'calculo' });

    act(() => result.current.logClick('subject:7', SearchClickSource.RESULT));
    act(() => result.current.logClick('subject:7', SearchClickSource.RELATED));
    act(() => result.current.logClick('class:3', SearchClickSource.RELATED));
    rerender({ query: 'calculo i' });
    act(() => result.current.logClick('subject:7', SearchClickSource.RESULT));

    expect(service.click.mock.calls.map(([body]) => body.doc_key)).toEqual([
      'subject:7',
      'class:3',
      'subject:7',
    ]);
  });

  it('logClick ignora consultas curtas e falhas no envio', async () => {
    service.click.mockRejectedValue(new Error('Network Error'));
    const { result, rerender } = setup({ query: 'a' });

    act(() => result.current.logClick('subject:7', SearchClickSource.RESULT));
    expect(service.click).not.toHaveBeenCalled();

    rerender({ query: 'calculo' });
    await act(async () => {
      result.current.logClick('subject:7', SearchClickSource.RESULT);
    });
    expect(service.click).toHaveBeenCalledTimes(1);
  });
});
