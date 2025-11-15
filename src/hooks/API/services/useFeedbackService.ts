import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { FeedbackResponse } from '../../../models/http/responses/feedback.response.models';
import { CreateFeedback } from '../../../models/http/requests/feedback.request.models';
import { PaginatedResponse } from '../../../models/http/responses/paginated.response.models';
import { PageSize } from '../../../utils/enums/pageSize.enum';

const useFeedbackService = () => {
  const axios = useAxiosPrivate();

  const getAllPaginated = (
    page?: number,
    page_size?: number,
  ): Promise<AxiosResponse<PaginatedResponse<FeedbackResponse>>> => {
    if (!page) page = 1;
    if (!page_size) page_size = PageSize.SIZE_10;
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('page_size', String(page_size));
    return axios.get('/admin/feedbacks', { params });
  };

  const create = (
    data: CreateFeedback,
  ): Promise<AxiosResponse<FeedbackResponse>> => {
    return axios.post('/feedbacks', data);
  };

  return { getAllPaginated, create };
};

export default useFeedbackService;
