import moment from 'moment';
import { Event, Resource } from '../interfaces/allocation.interfaces';
import { AllocationEventType } from '../../../utils/enums/allocation.event.type.enum';

const today = moment().format('YYYY-MM-DD');

export const TourGuideResources: Resource[] = [
  { id: 'Guide-Building', title: 'Seu Prédio' },
  { id: 'Guide-Classroom', title: 'Sua Sala', parentId: 'Guide-Building' },
];

export const TourGuideEvents: Event[] = [
  {
    id: 'Guide-Event',
    title: 'Seu Evento',
    start: `${today}T11:00:00`,
    end: `${today}T12:00:00`,
    type: AllocationEventType.EVENT,
    allDay: false,
    extendedProps: {},
    resourceId: 'Guide-Classroom',
  },
];
