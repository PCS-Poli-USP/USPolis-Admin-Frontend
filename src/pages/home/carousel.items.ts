import USPolisAllocation from './Images/USPolisAllocation.png';
import USPolisReservations from './Images/USPolisReservations.png';
import USPolisMySolicitations from './Images/USPolisMySolicitations.png';
import USPolisSolicitations from './Images/USPolisSolicitations.png';
import USPolisCalendars from './Images/USPolisCalendars.png';
import USPolisClassrooms from './Images/USPolisClassrooms.png';
import USPolisSubjects from './Images/USPolisSubjects.png';
import USPolisClasses from './Images/USPolisClasses.png';
import USPolisConflicts from './Images/USPolisConflicts.png';

import { VerticalCarouselItem } from './VerticalCarousel';

export const items: VerticalCarouselItem[] = [
  {
    title: 'Mapa de Salas',
    description:
      'Visualize a alocação de salas de aula da universidade, saida quando e onde a sua aula vai acontecer.',
    image: USPolisAllocation,
    alt: 'USPolisAllocation',
  },
  {
    title: 'Reserva de salas',
    description:
      'Reserve salas de aula para reuniões, provas, eventos institucionais, workshops e muito mais.',
    image: USPolisReservations,
    alt: 'USPolisReservations',
  },
  {
    title: 'Solicitação de Reservas',
    description:
      'Alunos e professores podem solicitar reservas de salas de aula para eventos acadêmicos. Agilize o processo e receba a resposta diretamente no seu e-mail.',
    image: USPolisMySolicitations,
    alt: 'USPolisMySolicitations',
  },
  {
    title: 'Aprovação/Recusa de Solicitações de Reservas',
    description:
      'Acelere o processo de reserva de salas de aula, aprovando ou recusando solicitações de reserva diretamente pelo nosso sistema.',
    image: USPolisSolicitations,
    alt: 'USPolisSolicitations',
  },
  {
    title: 'Calendário para alocações de salas',
    description:
      'Crie seus próprios calendários para os diferentes cursos e disciplinas da universidade. Reutilize calendários criados e visualize a alocação de salas de aula.',
    image: USPolisCalendars,
    alt: 'USPolisCalendars',
  },
  {
    title: 'Gestão de Salas de Aula',
    description:
      'Gerencie as salas de aulas do seu prédio, adicione novas salas, edite informações e visualize a alocação de salas de aula.',
    image: USPolisClassrooms,
    alt: 'USPolisClassrooms',
  },
  {
    title: 'Gestão de Disciplinas',
    description:
      'Gerencie as disciplinas que são oferecidas pelo seu instituto, adicione novas disciplinas, edite informações e visualize a alocação de salas de aula.',
    image: USPolisSubjects,
    alt: 'USPolisSubjects',
  },
  {
    title: 'Gestão de Turmas',
    description:
      'Com a praticidade de adicionar rapidamente todas as turmas a partir do jupiterweb, você pode gerenciar as turmas de cada disciplina, alocar as turmas em salas de aula e editar as informações das turmas.',
    image: USPolisClasses,
    alt: 'USPolisClasses',
  },
  {
    title: 'Visualização de Conflitos',
    description:
      'Utilize o sistema de visualização de conflitos para evitar a alocação de salas de aula em horários que já estão ocupados por outras disciplinas.',
    image: USPolisConflicts,
    alt: 'USPolisMySolicitations',
  },
  {
    title: 'Relatórios',
    description:
      'Obtenha relatórios detalhados sobre as disciplinas com suas turmas, horários  e salas. Obtenha também relatórios por sala, onde é possível visualizar todo o cronograma por sala.',
    image: USPolisAllocation,
    alt: 'USPolisAllocation',
  },
];
