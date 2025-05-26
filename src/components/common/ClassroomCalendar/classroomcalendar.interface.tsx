import { ClassroomFullResponse } from '../../../models/http/responses/classroom.response.models';

export interface ClassroomCalendarProps {
  classroom?: ClassroomFullResponse;
  initialDate?: string;
  h?: number;
  w?: number;
}
