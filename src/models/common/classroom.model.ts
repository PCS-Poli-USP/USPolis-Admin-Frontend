export default interface Classroom {
  id?: string;
  name: string;
  building: string;
  building_id?: string;
  floor: number;
  capacity: number;
  ignore_to_allocate: boolean;
  air_conditioning: boolean;
  projector: boolean;
  accessibility: boolean;
  updated_at?: Date;
  created_by?: string;
}

export interface ClassroomWithConflictCount extends Classroom {
  conflicts: number;
}

export interface ClassroomCreate {
  id?: string;
  name: string;
  building_id: string;
  floor: number;
  capacity: number;
  ignore_to_allocate: boolean;
  air_conditioning: boolean;
  projector: boolean;
  accessibility: boolean;
}

export function convertClassroomToClassroomCreate(
  classroom?: Classroom,
): ClassroomCreate | undefined {
  if (!classroom) return undefined;
  return {
    id: classroom.id,
    name: classroom.name,
    building_id: classroom.building_id || '',
    floor: classroom.floor,
    capacity: classroom.capacity,
    ignore_to_allocate: classroom.ignore_to_allocate,
    air_conditioning: classroom.air_conditioning,
    projector: classroom.projector,
    accessibility: classroom.accessibility,
  };
}

export interface AvailableClassroom {
  classroom_name: string;
  building: string;
  capacity: number;
  conflicted?: boolean;
}

export type TimeTuple = [string, string];

export interface ClassroomConflictMap {
  seg: TimeTuple[];
  ter: TimeTuple[];
  qua: TimeTuple[];
  qui: TimeTuple[];
  sex: TimeTuple[];
  sab: TimeTuple[];
  dom: TimeTuple[];
}

export interface ClassroomSchedule {
  seg: TimeTuple[];
  ter: TimeTuple[];
  qua: TimeTuple[];
  qui: TimeTuple[];
  sex: TimeTuple[];
  sab: TimeTuple[];
  dom: TimeTuple[];
  conflict_map: ClassroomConflictMap;
  building: string;
  classroom_name: string;
  capacity: number;
}
