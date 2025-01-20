import { ClassResponse } from 'models/http/responses/class.response.models';
import { ReservationResponse } from 'models/http/responses/reservation.response.models';
import { ScheduleResponseBase } from 'models/http/responses/schedule.response.models';
import { AllocationEnum } from 'utils/enums/allocation.enum';
import { sortScheduleResponse } from 'utils/schedules/schedules.sorter';

type ScheduleMap = [string, string, string, ScheduleResponseBase];

// Schedule parent data, schedule
type ScheduleExtended = [string, ScheduleResponseBase];

// building, classroom, schedules datas
type ClassroomSchedules = [string, string, ScheduleExtended[]];

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
