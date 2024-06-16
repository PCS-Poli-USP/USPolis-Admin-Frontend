import { ScheduleData } from "../../class.modal.interface";

export function sortScheduleData(A: ScheduleData, B: ScheduleData) {
  if (A.recurrence < B.recurrence) return -1;
  if (A.recurrence > B.recurrence) return 1;
  return 0;
}