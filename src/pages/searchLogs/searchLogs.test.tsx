import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchLogSummaryResponse } from '../../models/http/responses/search.response.models';
import { renderWithProviders } from '../../test/renderWithProviders';
import SearchLogs, { SEARCH_LOG_LIST_LIMIT } from '.';

// Stable object: the page's effect depends on the service reference.
const service = { getSummary: vi.fn() };
vi.mock('../../hooks/API/services/useSearchLogService', () => ({
  default: () => service,
}));

const summary: SearchLogSummaryResponse = {
  since_days: 30,
  total_searches: 40,
  distinct_queries: 12,
  empty_searches: 10,
  queries: [
    {
      query: 'bandejao',
      searches: 6,
      empty_searches: 6,
      last_result_count: 0,
      last_searched_at: '2026-11-20T14:05:00',
    },
    {
      query: 'monitoria fisica',
      searches: 3,
      empty_searches: 1,
      last_result_count: 4,
      last_searched_at: '2026-11-19T09:30:00',
    },
  ],
};

describe('SearchLogs (registro de buscas)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    service.getSummary.mockResolvedValue({ data: summary });
  });

  it('abre nas buscas sem resultado dos últimos 30 dias, com totais e tabela', async () => {
    renderWithProviders(<SearchLogs />);

    expect(service.getSummary).toHaveBeenCalledWith({
      days: 30,
      only_empty: true,
      limit: SEARCH_LOG_LIST_LIMIT,
    });
    expect(await screen.findByText('bandejao')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('25% das buscas')).toBeInTheDocument();

    const [, bandejao, monitoria] = screen.getAllByRole('row');
    expect(within(bandejao).getByText('Sem resultado')).toBeInTheDocument();
    expect(within(monitoria).getByText('4 resultados')).toBeInTheDocument();
    expect(
      within(bandejao).getByRole('link', { name: 'Abrir "bandejao" na busca' }),
    ).toHaveAttribute('href', '/public/search?q=bandejao');
  });

  it('troca de visão e de período refazem a consulta', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchLogs />);
    await screen.findByText('bandejao');

    await user.click(screen.getByRole('button', { name: 'Mais buscadas' }));
    await waitFor(() =>
      expect(service.getSummary).toHaveBeenLastCalledWith({
        days: 30,
        only_empty: false,
        limit: SEARCH_LOG_LIST_LIMIT,
      }),
    );

    await user.click(screen.getByRole('button', { name: '90 dias' }));
    await waitFor(() =>
      expect(service.getSummary).toHaveBeenLastCalledWith({
        days: 90,
        only_empty: false,
        limit: SEARCH_LOG_LIST_LIMIT,
      }),
    );
  });

  it('sem registros mostra mensagem vazia', async () => {
    service.getSummary.mockResolvedValue({
      data: {
        ...summary,
        total_searches: 0,
        distinct_queries: 0,
        empty_searches: 0,
        queries: [],
      },
    });
    renderWithProviders(<SearchLogs />);

    expect(
      await screen.findByText('Nenhuma busca sem resultado no período.'),
    ).toBeInTheDocument();
  });
});
