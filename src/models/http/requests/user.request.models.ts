export interface CreateUser {
  name: string;
  email: string;
  is_admin: boolean;
  building_ids?: Array<number>;
}

export interface UpdateUser {
  is_admin: boolean;
  group_ids?: Array<number>;
  receive_emails?: boolean;
}
