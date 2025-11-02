/* eslint-disable @typescript-eslint/no-empty-object-type */
import MakeOptional, { XORN } from '../../../utils/types/generics';
import { CreateEvent } from './event.request.models';
import { CreateExam } from './exam.request.models';
import { CreateMeeting } from './meeting.request.models';

type ExamSolicitation = MakeOptional<CreateExam, 'classroom_id'>;
type MeetingSolicitation = MakeOptional<CreateMeeting, 'classroom_id'>;
type EventSolicitation = MakeOptional<CreateEvent, 'classroom_id'>;

type SolicitationData = XORN<
  [ExamSolicitation, MeetingSolicitation, EventSolicitation]
>;

export interface CreateSolicitation {
  capacity: number;
  required_classroom: boolean;
  building_id: number;
  reservation_data: SolicitationData;
}

export interface ApproveSolicitation {
  classroom_id: number;
  classroom_name: string;
}

export interface UpdateSolicitation extends ApproveSolicitation {}

export interface DeleteSolicitation extends CreateSolicitation {}

export interface DenySolicitation {
  justification: string;
}
