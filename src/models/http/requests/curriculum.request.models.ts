export interface CreateCurriculum {
    course_id: number;
    AAC: number;
    AEX: number;
    description: string;
}

export interface UpdateCurriculum extends CreateCurriculum {}
