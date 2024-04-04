import {
  ClassroomConflictMap,
  ClassroomSchedule,
  TimeTuple,
} from 'models/classroom.model';
import {
  WeekDaysKeyNumber,
  WeekDaysShortDict,
  WeekDaysShortText,
} from 'models/enums/weekDays.enum';

export class ConflictCalculator {
  /**
   * Função que converte uma string para um objeto Date.
   * @param time
   * @returns
   */
  static timeParse(time: string): Date {
    return new Date('1970-01-01T' + time);
  }

  /**
   * Função que compara duas strings A e B represetando um horário.
   * Se A é menor que B retorna -1, se A é maior que B retorna 1 e caso
   * contrário retorna 0.
   * @param time_A
   * @param time_B
   * @returns
   */
  static timeCompare(time_A: string, time_B: string) {
    let first = this.timeParse(time_A);
    let second = this.timeParse(time_B);

    if (first < second) return -1;
    if (first > second) return 1;
    return 0;
  }

  static timeTupleCompare(tupleA: TimeTuple, tupleB: TimeTuple) {
    const start_compare = this.timeCompare(tupleA[0], tupleB[0]);
    if (start_compare !== 0) return start_compare;

    const end_compare = this.timeCompare(tupleA[1], tupleB[1]);
    if (end_compare !== 0) return end_compare;

    return 0;
  }

  static isTimeInTimeTupleArray(
    times: TimeTuple[],
    start: string,
    end: string,
  ) {
    for (let i = 0; i < times.length; i++) {
      if (times[i][0] === start && times[i][1] === end) return true;
    }
    return false;
  }

  static timeOverlapVerify(time_A: [string, string], time_B: [string, string]) {
    const start_A = this.timeParse(time_A[0]);
    const end_A = this.timeParse(time_A[1]);
    const start_B = this.timeParse(time_B[0]);
    const end_B = this.timeParse(time_B[1]);

    if (start_A <= start_B && end_A >= start_B) {
      return true;
    }
    if (start_A >= start_B && end_A <= end_B) {
      return true;
    }
    if (start_A >= start_B && start_A <= end_B) {
      return true;
    }
    if (start_A <= start_B && end_A >= end_B) {
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
        seg: [],
        ter: [],
        qua: [],
        qui: [],
        sex: [],
        sab: [],
        dom: [],
      },
      capacity: 0,
    };
    return schedule;
  }

  static defaultConflictMap(): ClassroomConflictMap {
    const conflict_map: ClassroomConflictMap = {
      seg: [],
      ter: [],
      qua: [],
      qui: [],
      sex: [],
      sab: [],
      dom: [],
    };
    return conflict_map;
  }

  static weekDayWillHaveTimesConflict(
    week_day_times: [string, string][],
    start_time: string,
    end_time: string,
  ) {
    for (let i = 0; i < week_day_times.length; i++) {
      if (this.timeOverlapVerify([start_time, end_time], week_day_times[i])) {
        return true;
      }
    }
    return false;
  }

  /**
   * Fução que recebe um calendário e um horário (dia, inicio e fim) e retorna um booleano representando
   * se terá ou não conflito.
   *
   * @param schedule
   * @param week_day
   * @param start_time
   * @param end_time
   * @returns
   */
  static verifyClassroomWillHaveTimeConclict(
    schedule: ClassroomSchedule,
    week_day: string,
    start_time: string,
    end_time: string,
  ) {
    return this.weekDayWillHaveTimesConflict(
      schedule[week_day as WeekDaysShortText],
      start_time,
      end_time,
    );
  }

  static verifyClassroomWeekDayTimeConflict(
    schedule: ClassroomSchedule,
    week_day: string,
  ): TimeTuple[] {
    const times = schedule[week_day as WeekDaysShortText];
    const conflited_times: TimeTuple[] = [];
    const added_indexes: boolean[] = new Array(times.length).fill(false);

    // times.sort(this.timeTupleCompare);
    for (let i = 0; i < times.length - 1; i++) {
      for (let j = i + 1; j < times.length; j++) {
        if (this.timeOverlapVerify(times[i], times[j])) {
          if (!added_indexes[i]) conflited_times.push(times[i]);
          if (!added_indexes[j]) conflited_times.push(times[j]);
        }
      }
    }
    return conflited_times;
  }

  /**
   * @example
   *
   * @param schedule Calendário de sala de aula
   *
   *@return
   * */
  static classroomHasTimeConflict(schedule: ClassroomSchedule) {
    if (!schedule.conflict_map)
      schedule.conflict_map = this.defaultConflictMap();

    for (let i = 0; i < 7; i++) {
      const day: string = WeekDaysShortDict[i as WeekDaysKeyNumber];
      const result = this.verifyClassroomWeekDayTimeConflict(schedule, day);
      if (result) schedule.conflict_map[day as WeekDaysShortText] = result;
    }
  }

  /**
   * Função que adiciona um novo horário ao calendário e atualiza seu mapeamento de conflito
   * caso o novo horário gere um conflito.
   *
   * @param {ClassroomSchedule} schedule Calendário que deseja-se adicionar um horário
   * @param {string} week_day Dia da semana
   * @param {string} start_time Horário de início
   * @param {string} end_time Horário de fim
   * @returns {ClassroomSchedule} Novo calendário com o horário adicionado e mapeamento atualizado
   */
  static addTimeInClassroomSchedule(
    schedule: ClassroomSchedule,
    week_day: string,
    start_time: string,
    end_time: string,
  ): ClassroomSchedule {
    const day = week_day as WeekDaysShortText;
    const newSchedule = { ...schedule };
    const newTimes = [...schedule[day]];
    newTimes.push([start_time, end_time]);
    newSchedule[day] = newTimes;

    const newConflictMap = { ...schedule.conflict_map };
    newConflictMap[day] = this.verifyClassroomWeekDayTimeConflict(
      newSchedule,
      day,
    );

    newSchedule.conflict_map = newConflictMap;
    return newSchedule;
  }

  static removeTimeInClassroomSchedule(
    schedule: ClassroomSchedule,
    week_day: string,
    start_time: string,
    end_time: string,
  ) {
    const day = week_day as WeekDaysShortText;
    const updatedSchedule = { ...schedule };
    const findIndex = updatedSchedule[day].findIndex(
      (time) => time[0] === start_time && time[1] === end_time,
    );

    if (findIndex !== -1) {
      const newTimes = [...updatedSchedule[day]];
      newTimes.splice(findIndex, 1);
      updatedSchedule[day] = newTimes;

      const newConflictMap = { ...schedule.conflict_map };
      newConflictMap[day] = this.verifyClassroomWeekDayTimeConflict(
        updatedSchedule,
        week_day,
      );
      updatedSchedule.conflict_map = newConflictMap;
    }

    return updatedSchedule;
  }
}
