import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SearchItemResponse,
  SearchResponse,
  SearchTopResponse,
} from '../../models/http/responses/search.response.models';
import { renderWithProviders } from '../../test/renderWithProviders';
import { SearchClickSource } from '../../utils/enums/searchClickSource.enum';
import { SearchEntityType } from '../../utils/enums/searchEntityType.enum';
import GeneralSearch from '.';

// Stable objects: the page's effects depend on these references.
const service = {
  search: vi.fn(),
  getDocument: vi.fn(),
  log: vi.fn(),
  click: vi.fn(),
};
vi.mock('../../hooks/API/services/useSearchService', () => ({
  default: () => service,
}));

const subject: SearchItemResponse = {
  doc_key: 'subject:7',
  type: SearchEntityType.SUBJECT,
  entity_id: '7',
  title: 'MAC0110 - Cálculo I',
  subtitle: 'João da Silva',
  score: 2,
  partial: false,
  payload: {
    code: 'MAC0110',
    name: 'Cálculo I',
    professors: ['João da Silva'],
    class_count: 1,
  },
};

const classroom: SearchItemResponse = {
  doc_key: 'classroom:7',
  type: SearchEntityType.CLASSROOM,
  entity_id: '7',
  title: 'B2-04',
  subtitle: 'Biênio',
  score: 1,
  partial: false,
  payload: {
    name: 'B2-04',
    building_id: 1,
    building: 'Biênio',
    floor: 2,
    capacity: 60,
    accessibility: false,
    air_conditioning: true,
  },
};

const response: SearchResponse = {
  query: 'calculo',
  top: { ...subject, related: [] },
  groups: [
    { type: SearchEntityType.SUBJECT, total: 1, items: [subject] },
    { type: SearchEntityType.CLASSROOM, total: 8, items: [classroom] },
  ],
  partial: false,
  intent_types: [],
};

const classroomDocument: SearchTopResponse = {
  ...classroom,
  related: [
    {
      type: SearchEntityType.BUILDING,
      total: 1,
      items: [
        {
          doc_key: 'building:1',
          type: SearchEntityType.BUILDING,
          entity_id: '1',
          title: 'Biênio',
          subtitle: null,
          score: 0,
          partial: false,
          payload: { name: 'Biênio', classroom_count: 30 },
        },
      ],
    },
  ],
};

describe('GeneralSearch (busca geral)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    service.search.mockResolvedValue({ data: response });
    service.getDocument.mockResolvedValue({ data: classroomDocument });
    service.log.mockResolvedValue({});
    service.click.mockResolvedValue({});
  });

  it('sem busca mostra só o campo e não chama a API', () => {
    renderWithProviders(<GeneralSearch />, { route: '/public/search' });

    expect(
      screen.getByRole('heading', { name: 'Busque no USPolis' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Pesquisar no USPolis' }),
    ).toHaveValue('');
    expect(service.search).not.toHaveBeenCalled();
  });

  it('hidrata a busca a partir de ?q= na URL e mostra grupos e destaque', async () => {
    renderWithProviders(<GeneralSearch />, {
      route: '/public/search?q=calculo',
    });

    expect(
      screen.getByRole('textbox', { name: 'Pesquisar no USPolis' }),
    ).toHaveValue('calculo');
    expect(
      await screen.findByRole('region', {
        name: 'Destaque: MAC0110 - Cálculo I',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Disciplinas/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Salas/ })).toBeInTheDocument();
    expect(screen.getByText('9 resultados')).toBeInTheDocument();
    expect(service.search).toHaveBeenCalledWith(
      { q: 'calculo', types: undefined, limit: 5 },
      expect.any(AbortSignal),
    );
  });

  it('digitar dispara uma única busca com o texto final (debounce)', async () => {
    const user = userEvent.setup();
    renderWithProviders(<GeneralSearch />);

    await user.type(
      screen.getByRole('textbox', { name: 'Pesquisar no USPolis' }),
      'calculo',
    );

    await waitFor(() => expect(service.search).toHaveBeenCalledTimes(1));
    expect(service.search.mock.calls[0][0]).toMatchObject({ q: 'calculo' });
  });

  it('clicar num resultado mostra o documento e seus relacionados', async () => {
    const user = userEvent.setup();
    renderWithProviders(<GeneralSearch />, {
      route: '/public/search?q=calculo',
    });

    await user.click(await screen.findByRole('button', { name: /B2-04/ }));

    expect(service.getDocument).toHaveBeenCalledWith(
      'classroom:7',
      undefined,
      expect.any(AbortSignal),
    );
    const panel = await screen.findByRole('region', {
      name: 'Destaque: B2-04',
    });
    expect(
      within(panel).getByRole('button', { name: /Voltar ao melhor resultado/ }),
    ).toBeInTheDocument();
    expect(within(panel).getByText('Prédios')).toBeInTheDocument();
    expect(
      within(panel).getByRole('button', { name: /Biênio/ }),
    ).toBeInTheDocument();
    // Opening a result logs the query right away, once, and the result.
    expect(service.log).toHaveBeenCalledTimes(1);
    expect(service.log).toHaveBeenCalledWith({
      q: 'calculo',
      types: undefined,
    });
    expect(service.click).toHaveBeenCalledWith({
      q: 'calculo',
      types: undefined,
      doc_key: 'classroom:7',
      source: SearchClickSource.RESULT,
    });

    // A document of the highlight panel counts as "related".
    await user.click(within(panel).getByRole('button', { name: /Biênio/ }));
    expect(service.click).toHaveBeenLastCalledWith({
      q: 'calculo',
      types: undefined,
      doc_key: 'building:1',
      source: SearchClickSource.RELATED,
    });
  });

  it('"Ver N" filtra pelo tipo do grupo', async () => {
    const user = userEvent.setup();
    renderWithProviders(<GeneralSearch />, {
      route: '/public/search?q=calculo',
    });

    await user.click(await screen.findByRole('button', { name: 'Ver 8' }));

    await waitFor(() =>
      expect(service.search).toHaveBeenLastCalledWith(
        { q: 'calculo', types: [SearchEntityType.CLASSROOM], limit: 20 },
        expect.any(AbortSignal),
      ),
    );
    expect(
      screen.getByRole('button', { name: 'Salas', pressed: true }),
    ).toBeInTheDocument();
  });

  it('sem resultados mostra dica de busca', async () => {
    service.search.mockResolvedValue({
      data: {
        query: 'xyz',
        top: null,
        groups: [],
        partial: false,
        intent_types: [],
      },
    });
    renderWithProviders(<GeneralSearch />, {
      route: '/public/search?q=xyz',
    });

    expect(
      await screen.findByText('Nenhum resultado para “xyz”'),
    ).toBeInTheDocument();
  });

  it('resultados parciais avisam que nem todas as palavras foram encontradas', async () => {
    service.search.mockResolvedValue({
      data: {
        ...response,
        query: 'calculo fotossintese',
        partial: true,
      },
    });
    renderWithProviders(<GeneralSearch />, {
      route: '/public/search?q=calculo%20fotossintese',
    });

    expect(
      await screen.findByText(
        'Nenhum resultado com todas as palavras. Mostrando os mais próximos.',
      ),
    ).toBeInTheDocument();
  });

  it('tipo pedido sem resultado avisa e mostra o resto', async () => {
    service.search.mockResolvedValue({
      data: {
        ...response,
        query: 'prova de calculo',
        intent_types: [SearchEntityType.EXAM, SearchEntityType.SUBJECT],
      },
    });
    renderWithProviders(<GeneralSearch />, {
      route: '/public/search?q=prova%20de%20calculo',
    });

    // Subjects came back, exams did not: only exams are reported missing.
    expect(
      await screen.findByText(
        'Nada encontrado em Provas. Mostrando outros resultados.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Nenhum resultado com todas as palavras/),
    ).not.toBeInTheDocument();
  });

  it('resultado completo e sem tipo pedido não mostra aviso', async () => {
    renderWithProviders(<GeneralSearch />, {
      route: '/public/search?q=calculo',
    });

    await screen.findByRole('region', {
      name: 'Destaque: MAC0110 - Cálculo I',
    });
    expect(screen.queryByText(/Mostrando/)).not.toBeInTheDocument();
  });

  it('erro na API mostra alerta', async () => {
    service.search.mockRejectedValue(new Error('Network Error'));
    renderWithProviders(<GeneralSearch />, {
      route: '/public/search?q=calculo',
    });

    expect(
      await screen.findByText(/Não foi possível buscar agora/),
    ).toBeInTheDocument();
  });
});
