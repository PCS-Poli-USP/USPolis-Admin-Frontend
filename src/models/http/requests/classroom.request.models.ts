export interface CreateClassroom {
  name: string;
  building_id: number;
  floor: number;
  capacity: number;
  ignore_to_allocate: boolean;
  air_conditioning: boolean;
  projector: boolean;
  accessibility: boolean;
}

export interface UpdateClassroom extends CreateClassroom {}
