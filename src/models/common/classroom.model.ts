export default interface Classroom {
  id?: string;
  classroom_name: string;
  building: string;
  floor: number;
  capacity: number;
  ignore_to_allocate: boolean;
  air_conditioning: boolean;
  projector: boolean;
  accessibility: boolean;
  updated_at?: string;
  created_by?: string;
}

export interface UnfetchClassroom {
  id: number;
  name: string;
  capacity: number;
  floor: number;
  ignore_to_allocate: boolean;
  accessibility: boolean;
  air_conditioning: boolean;
  updated_at: string;
  created_by_id: number;
  building_id: number;
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
