import { Building } from "./building.model";

export interface User {
    id: string;
    username: string;
    name?: string;
    is_admin: boolean;
    email: string;
    updated_at: string;
    created_by?: string;
    buildings: Array<Building>
}

export interface CreateUser {
    name: string;
    username: string;
    email: string;
    is_admin: boolean;
    building_ids?: Array<string>;
}

export interface CreateUserResponse {
    id: string;
}

export interface EditUser {
    building_ids?: Array<string>;
    is_admin?: boolean;
}