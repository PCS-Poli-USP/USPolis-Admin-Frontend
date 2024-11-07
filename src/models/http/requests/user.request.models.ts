export interface CreateUser {
  name: string;
  email: string;
  is_admin: boolean;
  building_ids?: Array<number>;
}

export interface UpdateUser {
  is_admin: boolean;
  building_ids?: Array<number>;
}
