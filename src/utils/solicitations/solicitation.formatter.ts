import moment from 'moment';
import { SolicitationResponse } from '../../models/http/responses/solicitation.response.models';
import { ReservationStatus } from '../enums/reservations.enum';

export function getSolicitationStatusText(solicitation: SolicitationResponse) {
  if (solicitation.status === ReservationStatus.APPROVED) {
    return `Situação: Aprovado por ${solicitation.closed_by} às ${moment(solicitation.updated_at).format('DD/MM/YYYY, HH:mm')}`;
  }
  if (solicitation.status === ReservationStatus.DENIED) {
    return `Situação: Negado por ${solicitation.closed_by} às ${moment(solicitation.updated_at).format('DD/MM/YYYY, HH:mm')}`;
  }
  if (solicitation.status === ReservationStatus.DELETED) {
    return `Situação: Removida por ${solicitation.deleted_by} às ${moment(solicitation.updated_at).format('DD/MM/YYYY, HH:mm')}`;
  }
  if (solicitation.status === ReservationStatus.PENDING) {
    return 'Situação: Pendente';
  }
  if (solicitation.status === ReservationStatus.CANCELLED) {
    return `Situação: Cancelada`;
  }
  return 'Situação: Desconhecida';
}

export function getRequesterText(solicitation: SolicitationResponse) {
  if (solicitation.status === ReservationStatus.PENDING) {
    return `Solicitante: ${solicitation.user} às ${moment(
      solicitation.created_at,
    ).format('DD/MM/YYYY, HH:mm')}`;
  }
  return `Solicitante: ${solicitation.user} às ${moment(
    solicitation.updated_at,
  ).format('DD/MM/YYYY, HH:mm')}`;
}

export function getSolicitationPlace(solicitation: SolicitationResponse) {
  const classroom = solicitation.reservation.classroom_name;
  return `${solicitation.building} · ${
    classroom ? `sala ${classroom}` : 'sala a definir'
  }`;
}

export function getSolicitationTimeRange(solicitation: SolicitationResponse) {
  const { start_time, end_time } = solicitation.reservation.schedule;
  if (!start_time || !end_time) return 'Não informado';
  return `${moment(start_time, 'HH:mm').format('HH:mm')} – ${moment(
    end_time,
    'HH:mm',
  ).format('HH:mm')}`;
}

export function getSolicitationDates(solicitation: SolicitationResponse) {
  return (solicitation.reservation.schedule.occurrences || [])
    .map((occurrence) => occurrence.date)
    .sort();
}

export function getSolicitationDatesSummary(
  solicitation: SolicitationResponse,
) {
  const dates = getSolicitationDates(solicitation);
  if (dates.length === 0) return 'Nenhuma data';
  const label = dates.length > 1 ? `${dates.length} datas` : '1 data';
  const preview = dates
    .slice(0, 3)
    .map((date) => moment(date).format('DD/MM'))
    .join(', ');
  return `${label} · ${preview}${dates.length > 3 ? '…' : ''}`;
}

export function getSolicitationUpdatedText(solicitation: SolicitationResponse) {
  return `Atualizada em ${moment(solicitation.updated_at).format(
    'DD/MM/YYYY [às] HH:mm',
  )}`;
}

export interface SolicitationTimelineStep {
  label: string;
  sub: string;
  state: 'done' | 'active' | 'todo' | 'ok' | 'bad' | 'warn';
}

export function getSolicitationTimeline(
  solicitation: SolicitationResponse,
): SolicitationTimelineStep[] {
  const closed = solicitation.status !== ReservationStatus.PENDING;
  const steps: SolicitationTimelineStep[] = [
    {
      label: 'Solicitação enviada',
      sub: `Em ${moment(solicitation.created_at).format(
        'DD/MM/YYYY [às] HH:mm',
      )}`,
      state: 'done',
    },
    {
      label: 'Em análise',
      sub: closed
        ? `Avaliada por ${solicitation.closed_by || 'você'}`
        : `Aguardando o responsável pelo prédio ${solicitation.building}`,
      state: closed ? 'done' : 'active',
    },
  ];

  const updated = moment(solicitation.updated_at).format(
    'DD/MM/YYYY [às] HH:mm',
  );
  switch (solicitation.status) {
    case ReservationStatus.PENDING:
      steps.push({
        label: 'Resultado',
        sub: 'Você será avisado por e-mail',
        state: 'todo',
      });
      break;
    case ReservationStatus.APPROVED:
      steps.push({
        label: `Aprovada — sala ${
          solicitation.reservation.classroom_name || ''
        }`,
        sub: `Em ${updated}`,
        state: 'ok',
      });
      break;
    case ReservationStatus.DENIED:
      steps.push({ label: 'Negada', sub: `Em ${updated}`, state: 'bad' });
      break;
    case ReservationStatus.CANCELLED:
      steps.push({
        label: 'Cancelada por você',
        sub: `Em ${updated}`,
        state: 'warn',
      });
      break;
    default:
      break;
  }
  return steps;
}

export interface SolicitationNotice {
  title: string;
  text: string;
  tone: 'success' | 'error';
}

export function getSolicitationNotice(
  solicitation: SolicitationResponse,
): SolicitationNotice | null {
  if (solicitation.status === ReservationStatus.APPROVED) {
    return {
      title: 'Sala designada',
      text: `Sala ${solicitation.reservation.classroom_name || '—'} no prédio ${
        solicitation.building
      }, confirmada por ${solicitation.closed_by || '—'}.`,
      tone: 'success',
    };
  }
  if (solicitation.status === ReservationStatus.DENIED) {
    return {
      title: `Negada por ${solicitation.closed_by || 'responsável pelo prédio'}`,
      text: 'A justificativa foi enviada para o seu e-mail — verifique a caixa de spam.',
      tone: 'error',
    };
  }
  return null;
}
