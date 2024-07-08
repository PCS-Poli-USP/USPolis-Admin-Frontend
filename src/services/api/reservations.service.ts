import { AxiosResponse } from 'axios';
import HttpService from './http.service';
import { ReservationResponse } from 'models/http/responses/reservation.response.models';
import {
  CreateReservation,
  UpdateReservation,
} from 'models/http/requests/reservation.request.models';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class ReservationsService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/reservations`);
  }

  list(): Promise<AxiosResponse<Array<ReservationResponse>>> {
    return this.http.get('');
  }

  create(data: CreateReservation): Promise<AxiosResponse<ReservationResponse>> {
    return this.http.post('', data);
  }

  delete(id: number): Promise<AxiosResponse<undefined>> {
    return this.http.delete(`/${id}`);
  }

  update(
    id: number,
    data: UpdateReservation,
  ): Promise<AxiosResponse<ReservationResponse>> {
    return this.http.put(`/${id}`, data);
  }
}
