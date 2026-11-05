import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import {
  CreateApiClient,
  CreateApiKey,
  CreateApiKeyViaLink,
  RevokeApiKey,
  SendApiKeyLinkEmail,
  UpdateApiClient,
  UpdateApiKey,
  UpdateApiKeyRateLimits,
} from '../../../models/http/requests/apiKey.request.models';
import {
  ApiClientResponse,
  ApiKeyCreatedResponse,
  ApiKeyDeliveryLinkResponse,
  ApiKeyLinkCreatedResponse,
  ApiKeyResponse,
} from '../../../models/http/responses/apiKey.response.models';

const CLIENTS_PREFIX = '/admin/api-clients';
const KEYS_PREFIX = '/admin/api-keys';
const DELIVERY_LINKS_PREFIX = '/admin/api-key-delivery-links';

const useApiKeysService = () => {
  const axios = useAxiosPrivate();

  const getClients = (): Promise<AxiosResponse<ApiClientResponse[]>> => {
    return axios.get(CLIENTS_PREFIX);
  };

  const getClientById = (
    id: number,
  ): Promise<AxiosResponse<ApiClientResponse>> => {
    return axios.get(`${CLIENTS_PREFIX}/${id}`);
  };

  const createClient = (
    data: CreateApiClient,
  ): Promise<AxiosResponse<ApiClientResponse>> => {
    return axios.post(CLIENTS_PREFIX, data);
  };

  const updateClient = (
    id: number,
    data: UpdateApiClient,
  ): Promise<AxiosResponse<ApiClientResponse>> => {
    return axios.put(`${CLIENTS_PREFIX}/${id}`, data);
  };

  const setClientActive = (
    id: number,
    is_active: boolean,
  ): Promise<AxiosResponse<ApiClientResponse>> => {
    return axios.patch(`${CLIENTS_PREFIX}/${id}/active`, { is_active });
  };

  const getClientKeys = (
    clientId: number,
  ): Promise<AxiosResponse<ApiKeyResponse[]>> => {
    return axios.get(`${CLIENTS_PREFIX}/${clientId}/keys`);
  };

  const createKey = (
    clientId: number,
    data: CreateApiKey,
  ): Promise<AxiosResponse<ApiKeyCreatedResponse>> => {
    return axios.post(`${CLIENTS_PREFIX}/${clientId}/keys`, data);
  };

  const createKeyViaLink = (
    clientId: number,
    data: CreateApiKeyViaLink,
  ): Promise<AxiosResponse<ApiKeyLinkCreatedResponse>> => {
    return axios.post(`${CLIENTS_PREFIX}/${clientId}/keys/via-link`, data);
  };

  const sendKeyLinkEmail = (
    keyId: number,
    data: SendApiKeyLinkEmail,
  ): Promise<AxiosResponse<ApiKeyDeliveryLinkResponse>> => {
    return axios.post(`${KEYS_PREFIX}/${keyId}/share-link/email`, data);
  };

  // Also revokes the link's key, which nobody received.
  const invalidateDeliveryLink = (
    deliveryLinkId: number,
  ): Promise<AxiosResponse<ApiKeyDeliveryLinkResponse>> => {
    return axios.patch(`${DELIVERY_LINKS_PREFIX}/${deliveryLinkId}/invalidate`);
  };

  const getKeyById = (id: number): Promise<AxiosResponse<ApiKeyResponse>> => {
    return axios.get(`${KEYS_PREFIX}/${id}`);
  };

  const updateKey = (
    id: number,
    data: UpdateApiKey,
  ): Promise<AxiosResponse<ApiKeyResponse>> => {
    return axios.put(`${KEYS_PREFIX}/${id}`, data);
  };

  const setKeyRateLimits = (
    id: number,
    data: UpdateApiKeyRateLimits,
  ): Promise<AxiosResponse<ApiKeyResponse>> => {
    return axios.put(`${KEYS_PREFIX}/${id}/rate-limits`, data);
  };

  const revokeKey = (
    id: number,
    data: RevokeApiKey,
  ): Promise<AxiosResponse<ApiKeyResponse>> => {
    return axios.patch(`${KEYS_PREFIX}/${id}/revoke`, data);
  };

  return {
    getClients,
    getClientById,
    createClient,
    updateClient,
    setClientActive,
    getClientKeys,
    createKey,
    createKeyViaLink,
    sendKeyLinkEmail,
    invalidateDeliveryLink,
    getKeyById,
    updateKey,
    setKeyRateLimits,
    revokeKey,
  };
};

export default useApiKeysService;
