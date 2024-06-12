export interface DayTime {
  hours: number;
  minutes: number;
}

export namespace DayTime {
  export function toString(day_time: DayTime): string {
    const { hours, minutes } = day_time;
    return `${hours}:${minutes}`;
  }
}
