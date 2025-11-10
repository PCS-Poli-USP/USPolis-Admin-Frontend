import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { FeedbackResponse } from '../../../models/http/responses/feedback.response.models';
import { CreateFeedback } from '../../../models/http/requests/feedback.request.models';

const useFeedbackService = () => {
  const axios = useAxiosPrivate();

  const getAll = (): Promise<AxiosResponse<Array<FeedbackResponse>>> => {
    return axios.get('/admin/feedbacks');
  };

  const create = (
    data: CreateFeedback,
  ): Promise<AxiosResponse<FeedbackResponse>> => {
    return axios.post('/feedbacks', data);
  };

  return { getAll, create };
};

export default useFeedbackService;
