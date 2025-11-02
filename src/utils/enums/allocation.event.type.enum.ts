/* eslint-disable @typescript-eslint/no-namespace */
export enum AllocationEventType {
  SUBJECT = 'subject',
  EXAM = 'exam',
  MEETING = 'meeting',
  EVENT = 'event',
}

export namespace AllocationEventType {
  export function getValues(): AllocationEventType[] {
    return [
      AllocationEventType.SUBJECT,
      AllocationEventType.EXAM,
      AllocationEventType.MEETING,
      AllocationEventType.EVENT,
    ];
  }
}
