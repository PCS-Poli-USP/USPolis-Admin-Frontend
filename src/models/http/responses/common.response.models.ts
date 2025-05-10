import { AxiosError } from 'axios';

export interface ErrorResponse {
  detail: string;
}

export type AxiosErrorResponse = AxiosError<ErrorResponse>;

export function isAxiosErrorResponse(error: any): error is AxiosErrorResponse {
  return error.isAxiosError && error.response !== undefined;
}

export interface JSONResponse {
  message: string;
}

export type NoContentResponse = object
