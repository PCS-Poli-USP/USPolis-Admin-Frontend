/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface GroupRequest {
  name: string;
  classroom_ids: number[];
  user_ids: number[];
}

export interface GroupUpdate extends GroupRequest {}
