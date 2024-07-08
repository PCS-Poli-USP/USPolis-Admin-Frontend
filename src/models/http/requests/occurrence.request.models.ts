import { DayTime } from "models/common/common.models";

interface OccurrenceBase {
    schedule_id: number;
    classroom_id?: number;
    start_time: DayTime;
    end_time: DayTime;
}

export interface CreateOccurrence extends OccurrenceBase {
  date: string;
}

export interface UpdateOccurrence extends OccurrenceBase {
  date: string;
}

export interface CreateManyOccurrence extends OccurrenceBase {
  dates: string[];
}