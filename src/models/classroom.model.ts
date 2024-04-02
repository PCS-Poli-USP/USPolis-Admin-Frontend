export default interface Classroom {
  classroom_name: string;
  building: string;
  floor: number;
  capacity: number;
  ignore_to_allocate: boolean;
  air_conditioning: boolean;
  projector: boolean;
  accessibility: boolean;
  updated_at?: string;
}

export interface AvailableClassroom {
  classroom_name: string;
  building: string;
  capacity: number;
  conflicted?: boolean;
}

export interface ClassroomConflictMap {
  'seg' : boolean,
  'ter' : boolean,
  'qua' : boolean,
  'qui' : boolean,
  'sex' : boolean,
  'sab' : boolean,
  'dom' : boolean,
}

export interface ClassroomSchedule {
  seg: [string, string][];
  ter: [string, string][];
  qua: [string, string][];
  qui: [string, string][];
  sex: [string, string][];
  sab: [string, string][];
  dom: [string, string][];
  conflict_map: ClassroomConflictMap;
  building: string;
  classroom_name: string;
  capacity: number;
  
}