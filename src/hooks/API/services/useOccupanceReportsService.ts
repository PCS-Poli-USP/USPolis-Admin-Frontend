import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import OccupanceReports from '../../../models/http/responses/occupanceReports.response.models';

const useOccupanceReportsService = () => {
  const axios = useAxiosPrivate();

  const listByBuilding = ( //lista vai receber o que for retornado do axios.get usando a variável recebida de buildingId
    buildingId: number, 
    startDate?: string, 
    endDate?: string
  ): Promise<AxiosResponse<OccupanceReports[]>> => { // tipo de retorno: uma promise que quando se resolve contém um AxiosResponse com uma lista de objetos do tipo OccupanceReports
    return axios.get(`/buildings/occupance_reports/${buildingId}`,
      {
        params: {
          ...(startDate ? { start_date: startDate } : {}),
          ...(endDate ? { end_date: endDate } : {}),
        },
      }
    );
  };

  return { listByBuilding };
};

export default useOccupanceReportsService;