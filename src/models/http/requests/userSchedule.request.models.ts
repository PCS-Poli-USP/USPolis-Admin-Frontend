export interface JupiterScheduleCrawlRequest {
  n_usp: string;
  password: string;
}

export interface CreateUserSchedule {
  schedule_ids: Array<number>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateUserSchedule extends CreateUserSchedule {}
