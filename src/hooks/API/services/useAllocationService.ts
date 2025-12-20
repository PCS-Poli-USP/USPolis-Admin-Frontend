import { AxiosResponse } from 'axios';
import {
  AllocationReuseResponse,
  AllocationEventResponse,
  AllocationResourceResponse,
} from '../../../models/http/responses/allocation.response.models';
import { JSONResponse } from '../../../models/http/responses/common.response.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import {
  AllocationMapInput,
  AllocationReuseInput,
  EventUpdate,
} from '../../../models/http/requests/allocation.request.models';

const useAllocationsService = () => {
  const PREFIX = '/allocations';
  const privateAxios = useAxiosPrivate();

  const listEvents = (
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Array<AllocationEventResponse>>> => {
    if (start && end)
      return privateAxios.get(`${PREFIX}/events`, { params: { start, end } });
    return privateAxios.get(`${PREFIX}/events`);
  };

  const listResources = (): Promise<
    AxiosResponse<Array<AllocationResourceResponse>>
  > => {
    return privateAxios.get(`${PREFIX}/resources`);
  };

  const update = (event: EventUpdate): Promise<AxiosResponse<JSONResponse>> => {
    return privateAxios.patch(`${PREFIX}/events`, event);
  };

  const getAllocationOptions = (
    data: AllocationReuseInput,
  ): Promise<AxiosResponse<AllocationReuseResponse>> => {
    return privateAxios.post(`${PREFIX}/reuse-options`, data);
  };

  const applyAllocationMap = (
    data: AllocationMapInput,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return privateAxios.post(`${PREFIX}/allocate-allocation-map`, data);
  };

  return {
    listEvents,
    listResources,
    update,
    getAllocationOptions,
    applyAllocationMap,
  };
};

export default useAllocationsService;
