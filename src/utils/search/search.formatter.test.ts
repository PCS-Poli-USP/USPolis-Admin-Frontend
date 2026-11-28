import moment from 'moment';
import { describe, expect, it } from 'vitest';
import { SearchItemResponse } from '../../models/http/responses/search.response.models';
import { SearchEntityType } from '../enums/searchEntityType.enum';
import { WeekDay } from '../enums/weekDays.enum';
import {
  describeSearchItem,
  formatReservationDates,
  formatSearchItemTitle,
  getClassLiveStatus,
  getReservationLiveStatus,
  isMonitoria,
  formatSearchSchedule,
  getClassPeriodStatus,
  highlightMatches,
  normalizeForSearch,
  sortSearchSchedules,
} from './search.formatter';

describe('normalizeForSearch', () => {
  it('remove acentos e caixa', () => {
    expect(normalizeForSearch('Cálculo Biênio JOÃO')).toBe(
      'calculo bienio joao',
    );
  });
});

describe('highlightMatches', () => {
  it('destaca termo ignorando acento e caixa', () => {
    expect(highlightMatches('Cálculo I', 'calculo')).toEqual([
      { text: 'Cálculo', match: true },
      { text: ' I', match: false },
    ]);
  });

  it('destaca vários termos e ocorrências', () => {
    const parts = highlightMatches('João da Silva Pereira', 'joao pereira');
    expect(parts.filter((p) => p.match).map((p) => p.text)).toEqual([
      'João',
      'Pereira',
    ]);
  });

  it('ignora termos com menos de 2 caracteres', () => {
    expect(highlightMatches('Sala A', 'a')).toEqual([
      { text: 'Sala A', match: false },
    ]);
  });

  it('não destaca nada quando não há ocorrência', () => {
    expect(highlightMatches('Biênio', 'mecanica')).toEqual([
      { text: 'Biênio', match: false },
    ]);
  });
});

describe('schedules', () => {
  const monday = {
    week_day: WeekDay.MONDAY,
    start_time: '13:10',
    end_time: '14:50',
    classroom: 'A1-02',
    building: 'Biênio',
  };

  it('formata dia, horário e local', () => {
    expect(formatSearchSchedule(monday)).toBe(
      'Segunda 13:10–14:50 · A1-02 (Biênio)',
    );
  });

  it('indica sala não alocada e dia indefinido', () => {
    expect(
      formatSearchSchedule({
        ...monday,
        week_day: null,
        classroom: null,
        building: null,
      }),
    ).toBe('Sem dia definido 13:10–14:50 · Sala não alocada');
  });

  it('ordena por dia e horário, sem dia por último', () => {
    const sorted = sortSearchSchedules([
      { ...monday, week_day: null },
      { ...monday, week_day: WeekDay.THURSDAY },
      { ...monday, start_time: '07:30' },
    ]);
    expect(sorted.map((s) => [s.week_day, s.start_time])).toEqual([
      [WeekDay.MONDAY, '07:30'],
      [WeekDay.THURSDAY, '13:10'],
      [null, '13:10'],
    ]);
  });
});

describe('getClassPeriodStatus', () => {
  const today = moment('2026-11-20');

  it('em andamento dentro do período (inclusive nas bordas)', () => {
    expect(getClassPeriodStatus('2026-08-31', '2026-12-14', today)).toBe(
      'current',
    );
    expect(getClassPeriodStatus('2026-11-20', '2026-11-20', today)).toBe(
      'current',
    );
  });

  it('em breve antes do início e encerrada depois do fim', () => {
    expect(getClassPeriodStatus('2027-03-01', '2027-07-01', today)).toBe(
      'upcoming',
    );
    expect(getClassPeriodStatus('2026-03-01', '2026-07-01', today)).toBe(
      'past',
    );
  });
});

describe('describeSearchItem', () => {
  const base = { entity_id: '1', subtitle: null, score: 1, partial: false };

  it('sala: prédio, andar, capacidade e recursos', () => {
    const item: SearchItemResponse = {
      ...base,
      doc_key: 'classroom:1',
      type: SearchEntityType.CLASSROOM,
      title: 'B2-04',
      payload: {
        name: 'B2-04',
        building_id: 1,
        building: 'Biênio',
        floor: 0,
        capacity: 60,
        accessibility: true,
        air_conditioning: false,
      },
    };
    expect(describeSearchItem(item)).toEqual([
      'Biênio · Térreo',
      'Capacidade: 60 · acessível',
    ]);
  });

  it('professor: contagens no singular e plural', () => {
    const item: SearchItemResponse = {
      ...base,
      doc_key: 'professor:joao',
      type: SearchEntityType.PROFESSOR,
      title: 'João',
      payload: { name: 'João', class_count: 3, subject_count: 1 },
    };
    expect(describeSearchItem(item)).toEqual(['1 disciplina · 3 turmas']);
  });
});

describe('getClassLiveStatus', () => {
  // PCS3111 turma 2026202: terça 15:00–17:40, período 03/08 a 12/12/2026
  const pcs3111 = {
    start_date: '2026-08-03',
    end_date: '2026-12-12',
    schedules: [
      {
        week_day: WeekDay.TUESDAY,
        start_time: '15:00',
        end_time: '17:40',
        classroom: 'C1-38 LAB (PCS)',
        building: 'Elétrica',
      },
    ],
  };
  const at = (datetime: string) => moment(datetime, 'YYYY-MM-DD HH:mm');

  it('dentro do período, mas sem aula no dia da semana de hoje', () => {
    // Sexta-feira 20/11 às 17:05: antes mostrava "Em andamento"
    expect(getClassLiveStatus(pcs3111, at('2026-11-20 17:05'))).toEqual({
      status: 'no_class_today',
      label: 'Sem aula hoje',
      color: 'gray',
    });
  });

  it('em andamento só no dia e no horário da aula', () => {
    expect(getClassLiveStatus(pcs3111, at('2026-11-17 15:00')).status).toBe(
      'now',
    );
    expect(getClassLiveStatus(pcs3111, at('2026-11-17 17:39')).status).toBe(
      'now',
    );
  });

  it('no dia da aula, antes do início e depois do fim', () => {
    expect(getClassLiveStatus(pcs3111, at('2026-11-17 14:00'))).toMatchObject({
      status: 'later_today',
      label: 'Hoje às 15:00',
    });
    expect(getClassLiveStatus(pcs3111, at('2026-11-17 17:40')).status).toBe(
      'done_today',
    );
  });

  it('usa o próximo horário do dia quando há mais de um', () => {
    const twice = {
      ...pcs3111,
      schedules: [
        { ...pcs3111.schedules[0], start_time: '19:00', end_time: '20:40' },
        pcs3111.schedules[0],
      ],
    };
    expect(getClassLiveStatus(twice, at('2026-11-17 18:00'))).toMatchObject({
      status: 'later_today',
      label: 'Hoje às 19:00',
    });
  });

  it('fora do período ignora o dia da semana', () => {
    expect(getClassLiveStatus(pcs3111, at('2026-12-15 16:00'))).toMatchObject({
      status: 'past',
      label: 'Turma encerrada',
    });
    expect(getClassLiveStatus(pcs3111, at('2026-08-01 16:00'))).toMatchObject({
      status: 'upcoming',
      label: 'Começa em 03/08',
    });
  });
});

describe('describeSearchItem (turma)', () => {
  it('mostra professores, período e horários', () => {
    const item: SearchItemResponse = {
      doc_key: 'class:1',
      type: SearchEntityType.CLASS,
      entity_id: '1',
      title: 'PCS3111 · Turma 2026202',
      subtitle: null,
      score: 1,
      partial: false,
      payload: {
        code: '2026202',
        subject_id: 1,
        subject_code: 'PCS3111',
        subject_name: 'Laboratório de Programação Orientada a Objetos',
        professors: ['Fulana de Tal'],
        start_date: '2026-08-03',
        end_date: '2026-12-12',
        schedules: [
          {
            week_day: WeekDay.TUESDAY,
            start_time: '15:00',
            end_time: '17:40',
            classroom: 'C1-38 LAB (PCS)',
            building: 'Elétrica',
          },
        ],
      },
    };
    expect(describeSearchItem(item)).toEqual([
      'Fulana de Tal',
      'Período: 03/08/2026 a 12/12/2026',
      'Terça 15:00–17:40 · C1-38 LAB (PCS) (Elétrica)',
    ]);
  });
});

describe('formatSearchItemTitle', () => {
  it('turma usa o número curto da turma', () => {
    const item: SearchItemResponse = {
      doc_key: 'class:1',
      type: SearchEntityType.CLASS,
      entity_id: '1',
      title: 'PCS3111 · Turma 2026202',
      subtitle: 'Laboratório de Programação Orientada a Objetos',
      score: 1,
      partial: false,
      payload: {
        code: '2026202',
        subject_id: 1,
        subject_code: 'PCS3111',
        subject_name: 'Laboratório de Programação Orientada a Objetos',
        professors: [],
        start_date: '2026-08-03',
        end_date: '2026-12-12',
        schedules: [],
      },
    };
    expect(formatSearchItemTitle(item)).toBe('PCS3111 · Turma 02');
  });
});

describe('reservas (provas, eventos, monitorias)', () => {
  const payload = {
    start_date: '2026-08-24',
    end_date: '2026-12-07',
    start_time: '11:00',
    end_time: '13:00',
    week_day: null,
    recurrence: 'custom',
    classroom_id: 1,
    classroom: 'B2-08 (PCS)',
    building_id: 1,
    building: 'Elétrica',
    event_type: 'talk',
    link: null,
    subjects: [{ id: 1, code: 'PEA3306', name: 'Conversão Eletromecânica' }],
    occurrences: [
      { date: '2026-11-17', start_time: '11:00', end_time: '13:00' },
      { date: '2026-11-20', start_time: '11:00', end_time: '13:00' },
      { date: '2026-11-24', start_time: '11:00', end_time: '13:00' },
    ],
  };
  const at = (datetime: string) => moment(datetime, 'YYYY-MM-DD HH:mm');
  const event: SearchItemResponse = {
    doc_key: 'reservation:1',
    type: SearchEntityType.EVENT,
    entity_id: '1',
    title: 'Monitoria PEA3306',
    subtitle: 'B2-08 (PCS) · Elétrica',
    score: 1,
    partial: false,
    payload,
  };

  it('status pelas ocorrências reais', () => {
    expect(
      getReservationLiveStatus(payload, at('2026-11-20 12:00')).label,
    ).toBe('Acontecendo agora');
    expect(
      getReservationLiveStatus(payload, at('2026-11-20 09:00')).label,
    ).toBe('Hoje às 11:00');
    expect(
      getReservationLiveStatus(payload, at('2026-11-20 14:00')).label,
    ).toBe('Próxima: 24/11');
    expect(
      getReservationLiveStatus(payload, at('2026-11-25 10:00')),
    ).toMatchObject({ status: 'past', label: 'Encerrada' });
  });

  it('última ocorrência já passou hoje', () => {
    expect(
      getReservationLiveStatus(payload, at('2026-11-24 14:00')).status,
    ).toBe('done_today');
  });

  it('sem ocorrências usa o intervalo do horário', () => {
    const unallocated = { ...payload, occurrences: [] };
    expect(
      getReservationLiveStatus(unallocated, at('2026-08-01 10:00')).label,
    ).toBe('Em 24/08');
    expect(
      getReservationLiveStatus(unallocated, at('2026-12-08 10:00')).status,
    ).toBe('past');
  });

  it('linhas de detalhe: datas, disciplina e tipo de evento', () => {
    expect(describeSearchItem(event)).toEqual([
      '3 datas · 17/11/2026 a 24/11/2026 · 11:00–13:00',
      'PEA3306 - Conversão Eletromecânica',
      'Palestra',
    ]);
  });

  it('data única', () => {
    expect(
      formatReservationDates({
        ...payload,
        occurrences: [payload.occurrences[0]],
      }),
    ).toBe('17/11/2026 · 11:00–13:00');
  });

  it('monitoria é identificada pelo título', () => {
    expect(isMonitoria(event)).toBe(true);
    expect(isMonitoria({ ...event, title: 'Palestra de abertura' })).toBe(
      false,
    );
  });
});
