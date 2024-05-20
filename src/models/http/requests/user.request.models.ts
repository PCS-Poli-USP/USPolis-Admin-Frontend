export interface CreateUser {
  name: string;
  username: string;
  email: string;
  isAdmin: boolean;
  building_ids?: Array<string>;
}