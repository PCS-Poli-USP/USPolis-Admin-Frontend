import { AxiosResponse } from 'axios';
import axios from '../../../services/api/axios';
import { RevealApiKeyLink } from '../../../models/http/requests/apiKey.request.models';
import {
  ApiKeyLinkPublicResponse,
  ApiKeyRevealedResponse,
} from '../../../models/http/responses/apiKey.response.models';

// Public routes opened by partners, who have no USPolis account.
const PREFIX = '/api-key-links';

const useApiKeyLinksService = () => {
  // Never consumes the link: safe for previews and reloads.
  const getStatus = (
    linkId: string,
  ): Promise<AxiosResponse<ApiKeyLinkPublicResponse>> => {
    return axios.get(`${PREFIX}/${linkId}`);
  };

  // Consumes the link: the key is returned only once.
  const reveal = (
    linkId: string,
    data: RevealApiKeyLink,
  ): Promise<AxiosResponse<ApiKeyRevealedResponse>> => {
    return axios.post(`${PREFIX}/${linkId}/reveal`, data);
  };

  return { getStatus, reveal };
};

export default useApiKeyLinksService;
