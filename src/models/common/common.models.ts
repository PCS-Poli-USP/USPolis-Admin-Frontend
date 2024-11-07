export interface DayTime {
  hours: number;
  minutes: number;
}

export namespace DayTime {
  export function toString(day_time: DayTime): string {
    const { hours, minutes } = day_time;
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
  }
  export function fromString(time: string): DayTime {
    const data = time.split(':');
    return { hours: Number(data[0]), minutes: Number(data[1]) };
  }
}
