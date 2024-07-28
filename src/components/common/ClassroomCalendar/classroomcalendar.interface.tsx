import { ClassroomFullResponse } from "models/http/responses/classroom.response.models";

export interface ClassroomCalendarProps {
  classroom?: ClassroomFullResponse;
  h?: number;
  w?: number;
}