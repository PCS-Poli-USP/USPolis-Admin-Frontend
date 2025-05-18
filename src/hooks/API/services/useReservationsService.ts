import { AxiosResponse } from 'axios';
import {
  ReservationResponse,
  ReservationFullResponse,
} from '../../../models/http/responses/reservation.response.models';
import {
  CreateReservation,
  UpdateReservation,
} from '../../../models/http/requests/reservation.request.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import axios from '../../../services/api/axios';

const useReservationsService = () => {
  const PREFIX = '/reservations';
  const axiosPrivate = useAxiosPrivate();

  const getMine = (): Promise<AxiosResponse<Array<ReservationResponse>>> => {
    return axiosPrivate.get(`/users/my-reservations`);
  };

  const get = (): Promise<AxiosResponse<Array<ReservationResponse>>> => {
    return axiosPrivate.get(PREFIX);
  };

  const getFull = (): Promise<
    AxiosResponse<Array<ReservationFullResponse>>
  > => {
    return axiosPrivate.get(`${PREFIX}}/full/`);
  };

  const getByBuildingName = (
    building_name: string,
  ): Promise<AxiosResponse<Array<ReservationResponse>>> => {
    return axios.get(`${PREFIX}/building/${building_name}`);
  };

  const getById = (id: number): Promise<AxiosResponse<ReservationResponse>> => {
    return axiosPrivate.get(`${PREFIX}/${id}`);
  };

  const create = (
    data: CreateReservation,
  ): Promise<AxiosResponse<ReservationResponse>> => {
    return axiosPrivate.post(PREFIX, data);
  };

  const deleteById = (id: number): Promise<AxiosResponse<undefined>> => {
    return axiosPrivate.delete(`${PREFIX}/${id}`);
  };

  const update = (
    id: number,
    data: UpdateReservation,
  ): Promise<AxiosResponse<ReservationResponse>> => {
    return axiosPrivate.put(`${PREFIX}/${id}`, data);
  };

  return {
    getMine,
    get,
    getFull,
    getByBuildingName,
    getById,
    create,
    deleteById,
    update,
  };
};

export default useReservationsService;
