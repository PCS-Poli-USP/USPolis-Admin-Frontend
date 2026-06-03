import { CrawlStatus } from '../../../utils/enums/crawlStatus.enum';
import { WeekDay } from '../../../utils/enums/weekDays.enum';
import { UserScheduleEntryResponse } from './userScheduleEntry.response.models';

export interface UserScheduleResponse {
  id: number | undefined;
  user_id: number;
  start_date: string | undefined;
  end_date: string | undefined;
  entries: UserScheduleEntryResponse[];
  created_at: string | undefined;
  updated_at: string | undefined;
}

// Crawler models

interface JupiterScheduleSlot {
  week_day: WeekDay;
  start_time: string;
  end_time: string;
}

interface JupiterStudentSubject {
  code: string;
  name: string;
  class_code: string;
  available_days: JupiterScheduleSlot[];
  observations: string;
}

export interface JupiterStudentScheduleResponse {
  n_usp: string;
  name: string;
  email: string;
  course: string;
  institute: string;
  subjects: JupiterStudentSubject[];
}

export interface UserScheduleCrawlResponse {
  status: CrawlStatus;
  updated: boolean;
  user_schedule: UserScheduleResponse | null;
  user_schedule_crawled: JupiterStudentScheduleResponse | null;
  missing_items: JupiterScheduleSlot[];
  message?: string;
}
