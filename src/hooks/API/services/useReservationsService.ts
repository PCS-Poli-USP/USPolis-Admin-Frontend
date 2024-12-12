import { AxiosResponse } from 'axios';
import {
  ReservationResponse,
  ReservationFullResponse,
} from 'models/http/responses/reservation.response.models';
import {
  CreateReservation,
  UpdateReservation,
} from 'models/http/requests/reservation.request.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const useReservationsService = () => {
  const PREFIX = '/reservations';
  const axios = useAxiosPrivate();

  const list = (): Promise<AxiosResponse<Array<ReservationResponse>>> => {
    return axios.get(PREFIX);
  };

  const listFull = (): Promise<
    AxiosResponse<Array<ReservationFullResponse>>
  > => {
    return axios.get(`${PREFIX}}/full/`);
  };

  const create = (
    data: CreateReservation,
  ): Promise<AxiosResponse<ReservationResponse>> => {
    return axios.post(PREFIX, data);
  };

  const deleteById = (id: number): Promise<AxiosResponse<undefined>> => {
    return axios.delete(`${PREFIX}/${id}`);
  };

  const update = (
    id: number,
    data: UpdateReservation,
  ): Promise<AxiosResponse<ReservationResponse>> => {
    return axios.put(`${PREFIX}/${id}`, data);
  };

  return { list, listFull, create, deleteById, update };
};

export default useReservationsService;
