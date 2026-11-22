import USPolisSearch from './Images/USPolisSearch.png';
import USPolisAllocation from './Images/USPolisAllocation.png';
import USPolisReservations from './Images/USPolisReservations.png';
import USPolisMySolicitations from './Images/USPolisMySolicitations.png';
import USPolisSolicitations from './Images/USPolisSolicitations.png';
import USPolisCalendars from './Images/USPolisCalendars.png';
import USPolisClassrooms from './Images/USPolisClassrooms.png';
import USPolisSubjects from './Images/USPolisSubjects.png';
import USPolisClasses from './Images/USPolisClasses.png';
import USPolisConflicts from './Images/USPolisConflicts.png';
import USPolisReports from './Images/USPolisReports.png';

import { VerticalCarouselItem, CarouselIconProps } from './VerticalCarousel';
import { BsCalendar3 } from 'react-icons/bs';
import { LuCalendarClock } from 'react-icons/lu';
import { MdAddChart, MdOutlinePendingActions, MdSearch } from 'react-icons/md';

export const icons: CarouselIconProps[] = [
  {
    id: 'search',
    icon: MdSearch,
    text: 'Busque no USPolis',
  },
  {
    id: 'allocation-map',
    icon: BsCalendar3,
    text: 'Mapa de Salas',
  },
  {
    id: 'reservations-solicitations',
    icon: MdOutlinePendingActions,
    text: 'Reservas e Solicitações',
  },
  {
    id: 'calendars',
    icon: LuCalendarClock,
    text: 'Datas e Calendários',
  },
  {
    id: 'offerings',
    icon: MdAddChart,
    text: 'Oferecimentos',
  },
];

export const items: VerticalCarouselItem[] = [
  {
    icon: icons[0],
    title: 'Busque no USPolis',
    description:
      'Encontre disciplinas, turmas, salas, prédios, professores, provas e monitorias em um só campo, sem precisar de login.',
    image: USPolisSearch,
    alt: 'USPolisSearch',
  },
  {
    icon: icons[1],
    title: 'Mapa de Salas',
    description:
      'Visualize a alocação de salas de aula da universidade, saida quando e onde a sua aula vai acontecer.',
    image: USPolisAllocation,
    alt: 'USPolisAllocation',
  },
  {
    icon: icons[2],
    title: 'Reserva de salas',
    description:
      'Reserve salas de aula para reuniões, provas, eventos institucionais, workshops e muito mais.',
    image: USPolisReservations,
    alt: 'USPolisReservations',
  },
  {
    icon: icons[2],
    title: 'Solicitação de Reservas',
    description:
      'Alunos e professores podem solicitar reservas de salas de aula para eventos acadêmicos. Agilize o processo e receba a resposta diretamente no seu e-mail.',
    image: USPolisMySolicitations,
    alt: 'USPolisMySolicitations',
  },
  {
    icon: icons[2],
    title: 'Gerenciar Solicitações de Reservas',
    description:
      'Acelere o processo de reserva de salas de aula, aprovando ou recusando solicitações de reserva diretamente pelo nosso sistema.',
    image: USPolisSolicitations,
    alt: 'USPolisSolicitations',
  },
  {
    icon: icons[3],
    title: 'Calendário para alocações de salas',
    description:
      'Crie seus próprios calendários para os diferentes cursos e disciplinas da universidade. Reutilize calendários criados e visualize a alocação de salas de aula.',
    image: USPolisCalendars,
    alt: 'USPolisCalendars',
  },
  {
    icon: icons[4],
    title: 'Gestão de Salas de Aula',
    description:
      'Gerencie as salas de aulas do seu prédio, adicione novas salas, edite informações e visualize a alocação de salas de aula.',
    image: USPolisClassrooms,
    alt: 'USPolisClassrooms',
  },
  {
    icon: icons[4],
    title: 'Gestão de Disciplinas',
    description:
      'Gerencie as disciplinas que são oferecidas pelo seu instituto, adicione novas disciplinas, edite informações e visualize a alocação de salas de aula.',
    image: USPolisSubjects,
    alt: 'USPolisSubjects',
  },
  {
    icon: icons[4],
    title: 'Gestão de Turmas',
    description:
      'Com a praticidade de adicionar rapidamente todas as turmas a partir do jupiterweb, você pode gerenciar as turmas de cada disciplina, alocar as turmas em salas de aula e editar as informações das turmas.',
    image: USPolisClasses,
    alt: 'USPolisClasses',
  },
  {
    icon: icons[4],
    title: 'Visualização de Conflitos',
    description:
      'Utilize o sistema de visualização de conflitos para evitar a alocação de salas de aula em horários que já estão ocupados por outras disciplinas.',
    image: USPolisConflicts,
    alt: 'USPolisMySolicitations',
  },
  {
    icon: icons[4],
    title: 'Relatórios',
    description:
      'Obtenha relatórios detalhados sobre as disciplinas com suas turmas, horários  e salas. Obtenha também relatórios por sala, onde é possível visualizar todo o cronograma por sala.',
    image: USPolisReports,
    alt: 'USPolisReports',
  },
];
