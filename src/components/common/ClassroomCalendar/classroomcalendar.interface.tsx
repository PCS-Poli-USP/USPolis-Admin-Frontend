import { ClassroomWithSchedulesResponse } from "models/http/responses/classroom.response.models";

export interface ClassroomCalendarProps {
  classroom?: ClassroomWithSchedulesResponse;
  h?: number;
  w?: number;
}