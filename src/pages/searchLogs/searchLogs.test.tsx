import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchDocumentSort } from '../../models/http/requests/search.request.models';
import {
  SearchDocumentSummaryResponse,
  SearchLogSummaryResponse,
} from '../../models/http/responses/search.response.models';
import { SearchEntityType } from '../../utils/enums/searchEntityType.enum';
import { renderWithProviders } from '../../test/renderWithProviders';
import SearchLogs, {
  SEARCH_DOCUMENT_LIST_LIMIT,
  SEARCH_LOG_LIST_LIMIT,
} from '.';

// Stable object: the page's effect depends on the service reference.
const service = { getSummary: vi.fn(), getDocuments: vi.fn() };
vi.mock('../../hooks/API/services/useSearchLogService', () => ({
  default: () => service,
}));

const summary: SearchLogSummaryResponse = {
  since_days: 30,
  total_searches: 40,
  distinct_queries: 12,
  empty_searches: 10,
  clicked_queries: 3,
  queries: [
    {
      query: 'bandejao',
      searches: 6,
      empty_searches: 6,
      last_result_count: 0,
      last_searched_at: '2026-11-20T14:05:00',
      clicks: 0,
    },
    {
      query: 'monitoria fisica',
      searches: 3,
      empty_searches: 1,
      last_result_count: 4,
      last_searched_at: '2026-11-19T09:30:00',
      clicks: 2,
    },
  ],
};

const documents: SearchDocumentSummaryResponse = {
  since_days: 30,
  impressions: 200,
  clicks: 50,
  distinct_documents: 2,
  mean_click_position: 1.8,
  positions: [
    { position: 1, impressions: 100, clicks: 30, ctr: 0.3 },
    { position: 2, impressions: 100, clicks: 12, ctr: 0.12 },
  ],
  documents: [
    {
      doc_key: 'subject:7',
      type: SearchEntityType.SUBJECT,
      title: 'MAT2453 - Cálculo I',
      impressions: 80,
      clicks: 40,
      ctr: 0.5,
      trend: 2.4,
    },
    {
      doc_key: 'classroom:99',
      type: null,
      title: null,
      impressions: 0,
      clicks: 10,
      ctr: null,
      trend: null,
    },
  ],
};

describe('SearchLogs (registro de buscas)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    service.getSummary.mockResolvedValue({ data: summary });
    service.getDocuments.mockResolvedValue({ data: documents });
  });

  it('abre nas buscas sem resultado dos últimos 30 dias, com totais e tabela', async () => {
    renderWithProviders(<SearchLogs />);

    expect(service.getSummary).toHaveBeenCalledWith({
      days: 30,
      only_empty: true,
      only_unclicked: false,
      limit: SEARCH_LOG_LIST_LIMIT,
    });
    expect(await screen.findByText('bandejao')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('25% das buscas')).toBeInTheDocument();
    expect(screen.getByText('25% das consultas')).toBeInTheDocument();
    // The documents tab stays idle until opened.
    expect(service.getDocuments).not.toHaveBeenCalled();

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
        only_unclicked: false,
        limit: SEARCH_LOG_LIST_LIMIT,
      }),
    );

    await user.click(screen.getByRole('button', { name: '90 dias' }));
    await waitFor(() =>
      expect(service.getSummary).toHaveBeenLastCalledWith({
        days: 90,
        only_empty: false,
        only_unclicked: false,
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

  it('visão sem clique pede só consultas com resultado e sem clique', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchLogs />);
    await screen.findByText('bandejao');

    await user.click(screen.getByRole('button', { name: 'Sem clique' }));

    await waitFor(() =>
      expect(service.getSummary).toHaveBeenLastCalledWith({
        days: 30,
        only_empty: false,
        only_unclicked: true,
        limit: SEARCH_LOG_LIST_LIMIT,
      }),
    );
  });

  it('aba documentos mostra os mais abertos, tendência, CTR por posição e removidos', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchLogs />);
    await screen.findByText('bandejao');

    await user.click(screen.getByRole('tab', { name: 'Documentos' }));

    expect(service.getDocuments).toHaveBeenCalledWith({
      days: 30,
      sort: SearchDocumentSort.CLICKS,
      limit: SEARCH_DOCUMENT_LIST_LIMIT,
    });
    expect(await screen.findByText('MAT2453 - Cálculo I')).toBeInTheDocument();
    expect(screen.getByText('Disciplina')).toBeInTheDocument();
    expect(screen.getByLabelText('subindo, 2,4×')).toBeInTheDocument();
    expect(screen.getByText('(removido do índice)')).toBeInTheDocument();
    const positions = screen.getByRole('list', { name: 'CTR por posição' });
    expect(within(positions).getAllByRole('listitem')).toHaveLength(2);
    expect(
      screen.getByRole('link', { name: 'Ver "MAT2453 - Cálculo I" na busca' }),
    ).toHaveAttribute(
      'href',
      '/public/search?q=MAT2453%20-%20C%C3%A1lculo%20I&focus=subject%3A7',
    );
  });

  it('botões de ajuda explicam as métricas', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchLogs />);
    await user.click(screen.getByRole('tab', { name: 'Documentos' }));
    await screen.findByText('MAT2453 - Cálculo I');

    for (const question of [
      'O que são resultados abertos?',
      'O que são impressões?',
      'O que é o CTR por posição?',
      'O que é a posição média do clique?',
      'Como ler a tendência?',
    ]) {
      expect(
        screen.getByRole('button', { name: question }),
      ).toBeInTheDocument();
    }

    await user.click(screen.getByRole('button', { name: 'O que é CTR?' }));
    expect(
      await screen.findByText('CTR = cliques ÷ impressões'),
    ).toBeInTheDocument();

    // Inside a <th> the popover would inherit uppercase/nowrap and be clipped
    // by the table container, so it renders in a portal.
    await user.click(
      screen.getByRole('button', { name: 'Como ler a tendência?' }),
    );
    const formula = await screen.findByText(
      'média diária recente ÷ média diária de costume',
    );
    expect(screen.getByRole('table')).not.toContainElement(formula);
  });

  it('em alta e período refazem a consulta de documentos', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchLogs />);
    await user.click(screen.getByRole('tab', { name: 'Documentos' }));
    await screen.findByText('MAT2453 - Cálculo I');

    await user.click(screen.getByRole('button', { name: 'Em alta' }));
    await waitFor(() =>
      expect(service.getDocuments).toHaveBeenLastCalledWith({
        days: 30,
        sort: SearchDocumentSort.TRENDING,
        limit: SEARCH_DOCUMENT_LIST_LIMIT,
      }),
    );

    await user.click(screen.getByRole('button', { name: '7 dias' }));
    await waitFor(() =>
      expect(service.getDocuments).toHaveBeenLastCalledWith({
        days: 7,
        sort: SearchDocumentSort.TRENDING,
        limit: SEARCH_DOCUMENT_LIST_LIMIT,
      }),
    );
  });
});
