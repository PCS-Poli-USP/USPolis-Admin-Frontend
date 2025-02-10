import { ClassResponse } from 'models/http/responses/class.response.models';
import { ReservationResponse } from 'models/http/responses/reservation.response.models';
import {
  ScheduleResponse,
  ScheduleResponseBase,
} from 'models/http/responses/schedule.response.models';
import moment from 'moment';
import { classNumberFromClassCode } from 'utils/classes/classes.formatter';
import { AllocationEnum } from 'utils/enums/allocation.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';
import { sortScheduleResponse } from 'utils/schedules/schedules.sorter';

type ScheduleMap = [string, string, string, ScheduleResponseBase];

// Schedule parent data, schedule
type ScheduleExtended = [string, ScheduleResponse];

// building, classroom, schedules datas
type ClassroomSchedules = [string, string, ScheduleExtended[]];

// Classroom - Classes
type ClassClassroomMap = Map<string, ClassResponse[]>;

// start time - end time
type TimeRange = [string, string];

// time range - class
type OccupationMap = Map<TimeRange, string>;

// weekday - ocuppation map
export type WeekDayOccupationMap = Map<string, OccupationMap>;

// classroom - weeekday occupation map
type ClassroomOccupationMap = Map<string, WeekDayOccupationMap>;

export const OCCUPATION_EMPTY = 'LIVRE';

export function getTimeRanges(start: number) {
  const ranges: TimeRange[] = [];
  for (let i = start; i < 23; i++) {
    if (i < 10) {
      if (i === 9) {
        ranges.push([`0${i}:00`, `${i + 1}:00`]);
      } else ranges.push([`0${i}:00`, `0${i + 1}:00`]);
    } else ranges.push([`${i}:00`, `${i + 1}:00`]);
  }
  return ranges;
}

function getEmptyOccupationMap(): OccupationMap {
  const timeRanges = getTimeRanges(7);
  const occupationMap = new Map<TimeRange, string>();
  timeRanges.forEach((timeRange) => {
    occupationMap.set(timeRange, OCCUPATION_EMPTY);
  });
  return occupationMap;
}

function getEmptyWeekDayOccupationMap(): WeekDayOccupationMap {
  const map = new Map<string, OccupationMap>();
  const weekDays = WeekDay.getShortValues();
  weekDays.forEach((weekDay) => {
    map.set(WeekDay.translate(weekDay), getEmptyOccupationMap());
  });
  return map;
}

function insertClassInOccupationMap(
  text: string,
  schedule: ScheduleResponse,
  map: OccupationMap,
) {
  const start = moment(schedule.start_time, 'HH:mm');
  const end = moment(schedule.end_time, 'HH:mm');
  const timeRanges = Array.from(map.keys());
  timeRanges.forEach((timeRange, index) => {
    const rangeStart = moment(timeRange[0], 'HH:mm');
    const rangeEnd = moment(timeRange[1], 'HH:mm');
    if (rangeStart.isSameOrAfter(start) && rangeStart.isSameOrBefore(end)) {
      map.set(timeRange, text);
    }
    if (rangeEnd.isAfter(start) && rangeEnd.isSameOrBefore(end)) {
      map.set(timeRange, text);
    }
    if (rangeStart.isSameOrAfter(start) && rangeStart.isSameOrBefore(end)) {
      map.set(timeRange, text);
    }
  });
}

export function getClassroomOccupationMap(
  classes: ClassResponse[],
): ClassroomOccupationMap {
  const map = new Map<string, WeekDayOccupationMap>();
  classes.forEach((cls) => {
    const schedules = cls.schedules;
    schedules.forEach((schedule) => {
      const classroom = schedule.classroom;
      const weekDay =
        schedule.week_day !== undefined
          ? WeekDay.translate(schedule.week_day)
          : undefined;
      if (weekDay && classroom) {
        const weekDayOccupationMap = map.get(classroom);
        if (weekDayOccupationMap) {
          const occupationMap = weekDayOccupationMap.get(weekDay);
          if (occupationMap) {
            insertClassInOccupationMap(
              `${cls.subject_code} T${classNumberFromClassCode(cls.code)}`,
              schedule,
              occupationMap,
            );
          }
        } else {
          const newWeekDayOccupationMap = getEmptyWeekDayOccupationMap();
          const occupationMap = newWeekDayOccupationMap.get(weekDay);
          if (occupationMap) {
            insertClassInOccupationMap(
              `${cls.subject_code} T${classNumberFromClassCode(cls.code)}`,
              schedule,
              occupationMap,
            );
          }
          map.set(classroom, newWeekDayOccupationMap);
        }
      }
    });
  });
  const aux = Array.from(map).sort((a, b) => a[0].localeCompare(b[0]));
  return new Map(aux);
}

export function getClassClassroomMap(
  classes: ClassResponse[],
): ClassClassroomMap {
  const map = new Map<string, ClassResponse[]>();
  classes.forEach((cls) => {
    const classroom = cls.schedules[0].classroom;
    if (classroom) {
      const classList = map.get(classroom);
      if (classList) {
        classList.push(cls);
        map.set(classroom, classList);
      } else {
        map.set(classroom, [cls]);
      }
    } else {
      const unallocatedList = map.get(AllocationEnum.UNALLOCATED);
      if (unallocatedList) {
        unallocatedList.push(cls);
        map.set(AllocationEnum.UNALLOCATED, unallocatedList);
      } else {
        map.set(AllocationEnum.UNALLOCATED, [cls]);
      }
    }
  });
  const aux = Array.from(map).sort((a, b) => a[0].localeCompare(b[0]));
  return new Map(aux);
}

export function getSchedulesGroupedByClassroom(
  classes: ClassResponse[],
  reservations: ReservationResponse[],
) {
  const schedulesMap = getScheduleMap(classes, reservations);
  const schedulesGroup = schedulesMap.reduce(
    (
      group: Map<string, Map<string, [string, ScheduleResponseBase][]>>,
      map,
    ) => {
      const building = map[0];
      const classroom = map[1];
      const extendedData = map[2];
      const schedule = map[3];

      const buildingSchedules = group.get(building);
      if (buildingSchedules) {
        const classroomSchedules = buildingSchedules.get(classroom);
        if (classroomSchedules) {
          buildingSchedules.set(
            classroom,
            classroomSchedules.concat([[extendedData, schedule]]),
          );
        } else {
          buildingSchedules.set(classroom, [[extendedData, schedule]]);
        }
      } else {
        const classroomMap = new Map<
          string,
          [string, ScheduleResponseBase][]
        >();
        classroomMap.set(classroom, [[extendedData, schedule]]);
        group.set(building, classroomMap);
      }
      return group;
    },
    new Map(),
  );
  const schedulesByClassroom: ClassroomSchedules[] = [];
  schedulesGroup.forEach((classroomMap, building) => {
    const classroomData = Array.from(classroomMap);
    classroomData.forEach((data: any) => {
      schedulesByClassroom.push([
        building,
        data[0] as string,
        data[1] as ScheduleExtended[],
      ]);
    });
  });
  return schedulesByClassroom;
}

function getScheduleMap(
  classes: ClassResponse[],
  reservations: ReservationResponse[],
): ScheduleMap[] {
  const schedulesMap: ScheduleMap[] = [];
  classes.forEach((cls) =>
    schedulesMap.push(
      ...cls.schedules.map<ScheduleMap>((schedule) => [
        schedule.building || AllocationEnum.UNALLOCATED,
        schedule.classroom || AllocationEnum.UNALLOCATED,
        cls.subject_code,
        schedule,
      ]),
    ),
  );
  reservations.forEach((reservation) =>
    schedulesMap.push([
      reservation.building_name,
      reservation.classroom_name,
      `${reservation.title}`,
      reservation.schedule,
    ]),
  );
  schedulesMap.sort(sortScheduleMap);
  return schedulesMap;
}

function sortScheduleMap(A: ScheduleMap, B: ScheduleMap) {
  // Sort by buildings
  if (A[0] < B[0]) return -1;
  if (A[0] > B[0]) return 1;

  // Sort by Classrooms
  if (A[1] < B[1]) return -1;
  if (A[1] > B[1]) return 1;

  //Sort By Schedules
  return sortScheduleResponse(A[3], B[3]);
}
