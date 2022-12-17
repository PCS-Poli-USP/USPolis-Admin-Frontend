export default interface Classroom {
  classroom_name: string;
  building: string;
  floor: number;
  capacity: number;
  air_conditioning: boolean;
  projector: boolean;
  accessibility: boolean;
  updated_at?: string;
}

export interface AvailableClassroom {
  classroom_name: string;
  building: string;
  capacity: number;
}
