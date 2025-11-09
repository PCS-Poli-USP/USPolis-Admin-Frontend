export interface EventUpdate {
  desalocate: boolean;
  all_occurrences: boolean;
  start_time: string;
  end_time: string;
  building: string;
  classroom: string;
  occurrence_id?: number;
  schedule_id: number;
}

export interface AllocationReuseTarget {
  subject_id: number;
  class_ids: number[];
}

export interface AllocationReuseInput {
  building_id: number;
  allocation_year: number;
  targets: AllocationReuseTarget[];
  strict: boolean;
}

export interface AllocationMapValue {
  schedule_id: number;
  classroom_ids: number[];
}

export interface AllocationMapInput {
  allocation_map: AllocationMapValue[];
}
