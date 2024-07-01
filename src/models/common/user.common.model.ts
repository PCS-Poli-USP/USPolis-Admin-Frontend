import { BuildingResponse } from "models/http/responses/building.response.models";

export interface User {
    id: string;
    username: string;
    name?: string;
    is_admin: boolean;
    email: string;
    updated_at: string;
    created_by?: string;
    buildings?: Array<BuildingResponse>
}

export interface CreateUser {
    name: string;
    username: string;
    email: string;
    is_admin: boolean;
    building_ids?: Array<number>;
}

export interface CreateUserResponse {
    id: string;
}

export interface EditUser {
    building_ids?: Array<number>;
    is_admin?: boolean;
}