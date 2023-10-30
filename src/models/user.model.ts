export interface CreateUser {
    username: string;
    email: string;
    isAdmin: boolean;
    building_ids?: Array<string>;
}

export interface CreateUserResponse {
    id: string;
}