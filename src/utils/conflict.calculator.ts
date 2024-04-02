import {
  ClassroomConflictMap,
  ClassroomSchedule,
} from 'models/classroom.model';
import {
  WeekDaysKeyNumber,
  WeekDaysShortDict,
  WeekDaysShortText,
} from 'models/enums/weekDays.enum';

export class ConflictCalculator {
  static timeParse(time: string): Date {
    return new Date('1970-01-01T' + time);
  }

  static timeCompare(time_A: string, time_B: string) {
    let first = this.timeParse(time_A);
    let second = this.timeParse(time_B);

    if (first < second) return -1;
    if (first > second) return 1;
    return 0;
  }

  static timeTupleCompare(tupleA: [string, string], tupleB: [string, string]) {
    const start_compare = this.timeCompare(tupleA[0], tupleB[0]);
    if (start_compare !== 0) return start_compare;

    const end_compare = this.timeCompare(tupleA[1], tupleB[1]);
    if (end_compare !== 0) return end_compare;

    return 0;
  }

  static timeOverlapVerify(time_A: [string, string], time_B: [string, string]) {
    const start_A = this.timeParse(time_A[0]);
    const end_A = this.timeParse(time_A[1]);
    const start_B = this.timeParse(time_B[0]);
    const end_B = this.timeParse(time_B[1]);

    if (start_A <= start_B && end_A <= end_B) {
      console.log('Caso 1');
      return true;
    }
    if (start_A >= start_B && end_A <= end_B) {
      console.log('Caso 2');
      return true;
    }
    if (start_A >= start_B && start_A <= end_B) {
      console.log('Caso 3');
      return true;
    }
    if (start_A <= start_B && end_A >= end_B) {
      console.log('Caso 4');
      return true;
    }
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
      building: 'Não alocado',
      conflict_map: {
        seg: false,
        ter: false,
        qua: false,
        qui: false,
        sex: false,
        sab: false,
        dom: false,
      },
      capacity: 0,
    };
    return schedule;
  }

  static defaultConflictMap(): ClassroomConflictMap {
    const conflict_map: ClassroomConflictMap = {
      seg: false,
      ter: false,
      qua: false,
      qui: false,
      sex: false,
      sab: false,
      dom: false,
    };
    return conflict_map;
  }

  static weekDayWillHaveTimesConflict(
    week_day_times: [string, string][],
    start_time: string,
    end_time: string,
  ) {
    console.log('Aqui');
    for (let i = 0; i < week_day_times.length; i++) {
      console.log('Horário atual: ', week_day_times[i]);
      if (this.timeOverlapVerify([start_time, end_time], week_day_times[i])) {
        console.log('Overlap!');
        return true;
      }
    }
    return false;
  }

  static verifyClassroomWillHaveTimeConclict(
    schedule: ClassroomSchedule,
    week_day: string,
    start_time: string,
    end_time: string,
  ) {
    console.log('Calendario atual: ', schedule);
    console.log('Horário a adicionar: ', start_time, end_time, week_day);
    let a = this.weekDayWillHaveTimesConflict(
      schedule[week_day as WeekDaysShortText],
      start_time,
      end_time,
    );
    console.log('Resultado: ', a);
    return a;
  }

  static verifyClassroomWeekDayTimeConflict(
    schedule: ClassroomSchedule,
    week_day: string,
  ) {
    const times = schedule[week_day as WeekDaysShortText];
    times.sort(this.timeTupleCompare);
    for (let i = 1; i < times.length; i++) {
      if (this.timeOverlapVerify(times[i - 1], times[i])) {
        console.log('Horários: ', times, 'deu pau no', i, 'valor');
        return true;
      }
    }
    return false;
  }

  static classroomHasTimeConflict(schedule: ClassroomSchedule) {
    if (!schedule.conflict_map)
      schedule.conflict_map = this.defaultConflictMap();

    for (let i = 0; i < 7; i++) {
      const day: string = WeekDaysShortDict[i as WeekDaysKeyNumber];
      const result = this.verifyClassroomWeekDayTimeConflict(schedule, day);
      if (result) schedule.conflict_map[day as WeekDaysShortText] = result;
    }
  }

  static addTimeInClassroomSchedule(
    schedule: ClassroomSchedule,
    week_day: string,
    start_time: string,
    end_time: string,
  ): ClassroomSchedule {
    console.log('Adicionado', week_day, start_time, end_time, 'em: ', schedule);

    const day = week_day as WeekDaysShortText;
    const newSchedule = { ...schedule };
    const newTimes = [...schedule[day]];
    const newConflictMap = { ...schedule.conflict_map };

    newConflictMap[day] = this.verifyClassroomWillHaveTimeConclict(
      schedule,
      week_day,
      start_time,
      end_time,
    );

    newTimes.push([start_time, end_time]);
    newSchedule[day] = newTimes;
    newSchedule.conflict_map = newConflictMap;

    console.log('Resultado: ', newSchedule, 'Times', newTimes);
    return newSchedule;
  }

  static removeTimeInClassroomSchedule(
    schedule: ClassroomSchedule,
    week_day: string,
    start_time: string,
    end_time: string,
  ) {
    const updatedSchedule = { ...schedule };
    console.log(
      'Antigos horários: ',
      updatedSchedule[week_day as WeekDaysShortText],
    );

    const findIndex = updatedSchedule[week_day as WeekDaysShortText].findIndex(
      (time) => time[0] === start_time && time[1] === end_time,
    );

    if (findIndex !== -1) {
      const newTimes = updatedSchedule[week_day as WeekDaysShortText].splice(
        findIndex,
        1,
      );
      console.log('Novos horários:', newTimes);
      updatedSchedule[week_day as WeekDaysShortText] = newTimes;
      updatedSchedule.conflict_map[week_day as WeekDaysShortText] =
        this.verifyClassroomWeekDayTimeConflict(updatedSchedule, week_day);
    }
    console.log(
      'aPOS REMOVER ',
      start_time,
      end_time,
      week_day,
      'temos conflito = ',
      updatedSchedule.conflict_map,
    );
    return updatedSchedule;
  }
}
