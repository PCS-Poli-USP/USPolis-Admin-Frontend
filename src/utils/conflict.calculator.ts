import { ClassroomSchedule } from 'models/classroom.model';
import {
  WeekDays,
  WeekDaysKeyNumber,
  WeekDaysShortDict,
} from 'models/enums/weekDays.enum';

export class ConflictCalculator {
  static timeParse(time: string): Date {
    return new Date(time);
  }

  static timeCompare(time_A: string, time_B: string) {
    let first = this.timeParse(time_A);
    let second = this.timeParse(time_B);

    if (first < second) return -1;
    if (first > second) return 1;
    return 0;
  }

  static timeOverlapVerify(time_A: [string, string], time_B: [string, string]) {
    const start_A = this.timeParse(time_A[0]);
    const end_A = this.timeParse(time_A[1]);
    const start_B = this.timeParse(time_B[0]);
    const end_B = this.timeParse(time_B[1]);

    if (start_A <= start_B && end_A <= end_B) return true;
    if (start_A >= start_B && end_A <= end_B) return true;
    if (start_A >= start_B && start_A <= end_B) return true;
    if (start_A <= start_B && end_A >= end_B) return true;
    return false;
  }

  static defaultSchedule(): ClassroomSchedule {
    const schedule: ClassroomSchedule = {
      seg: [],
      ter: [],
      qua: [],
      qui: [],
      sex: [],
      sab: [],
      dom: [],
      classroom_name: 'Não alocado',
      has_conflict: false,
      capacity: 0,
    };
    return schedule;
  }

  static weekDayTimesConflict(
    week_day_times: [string, string][],
    start_time: string,
    end_time: string,
  ) {
    for (let times of week_day_times) {
      if (this.timeOverlapVerify([start_time, end_time], times)) return true;
    }
    return false;
  }

  static verifyClassroomWillHaveTimeConclict(
    schedule: ClassroomSchedule,
    week_day: string,
    start_time: string,
    end_time: string,
  ) {
    return this.weekDayTimesConflict(
      schedule[week_day as WeekDays],
      start_time,
      end_time,
    );
  }

  static verifyClassroomWeekDayTimeConflict(
    schedule: ClassroomSchedule,
    week_day: string,
  ) {
    const times = schedule[week_day as WeekDays];
    console.log('Horários: ', times);
    times.sort((tuple) => this.timeCompare(tuple[0], tuple[1]));
    for (let i = 1; i < times.length; i++) {
      if (this.timeOverlapVerify(times[i - 1], times[i])) return true;
    }
    return false;
  }

  static classroomHasTimeConflict(schedule: ClassroomSchedule) {
    for (let i = 0; i < 7; i++) {
      if (
        this.verifyClassroomWeekDayTimeConflict(
          schedule,
          WeekDaysShortDict[i as WeekDaysKeyNumber],
        )
      )
        return true;
    }
    return false;
  }

  static addTimeInClassroomSchedule(
    schedule: ClassroomSchedule,
    week_day: string,
    start_time: string,
    end_time: string,
  ): ClassroomSchedule {
    const newSchedule = { ...schedule };
    newSchedule.has_conflict = this.verifyClassroomWillHaveTimeConclict(
      schedule,
      week_day,
      start_time,
      end_time,
    );
    newSchedule[week_day as WeekDays].push([start_time, end_time]);
    return newSchedule;
  }

  static removeTimeInClassroomSchedule(
    schedule: ClassroomSchedule,
    week_day: string,
    start_time: string,
    end_time: string,
  ) {
    const updatedSchedule = { ...schedule };
    const newTimes = updatedSchedule[week_day as WeekDays].filter(
      (times) => times[0] !== start_time && times[1] !== end_time,
    );
    updatedSchedule[week_day as WeekDays] = newTimes;
    updatedSchedule.has_conflict = this.verifyClassroomWeekDayTimeConflict(
      updatedSchedule,
      week_day,
    );
    return updatedSchedule;
  }
}
