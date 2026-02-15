export default interface OccupanceReports {
  week_day: number;
  classroom: string;
  capacity: number;
  classes: string[];
  start_time: string;
  end_time: string;
  students: number;
  percentage: number;
  class_id: number[];
}
