import { Building } from "./building.model";

export interface User {
    id: string;
    username: string;
    isAdmin: boolean;
    email: string;
    updated_at: string;
    created_by?: string;
    buildings: Array<Building>
}

export interface CreateUser {
    name: string;
    username: string;
    email: string;
    isAdmin: boolean;
    building_ids?: Array<string>;
}

export interface CreateUserResponse {
    id: string;
}

export interface EditUser {
    building_ids?: Array<string>;
    isAdmin?: boolean;
}