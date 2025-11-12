/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import useCustomToast from '../useCustomToast';
import useFeedbackService from '../API/services/useFeedbackService';
import { FeedbackResponse } from '../../models/http/responses/feedback.response.models';
import FeedbackErrorParser from './feedbackErrorParser';
import { CreateFeedback } from '../../models/http/requests/feedback.request.models';
import { usePaginatedResponse } from '../API/usePaginatedResponse';

const useFeedbacks = () => {
  const service = useFeedbackService();
  const { pageResponse, setPageResponse } =
    usePaginatedResponse<FeedbackResponse>();
  const [loading, setLoading] = useState(false);

  const errorParser = new FeedbackErrorParser();
  const showToast = useCustomToast();

  const getFeedbacks = useCallback(async (page?: number, pageSize?: number) => {
    setLoading(true);
    await service
      .getAllPaginated(page, pageSize)
      .then((response) => {
        setPageResponse(response.data);
      })
      .catch((error) => {
        showToast('Erro', errorParser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const createFeedback = useCallback(async (data: CreateFeedback) => {
    setLoading(true);
    await service
      .create(data)
      .then((response) => {
        showToast('Sucesso', 'Feedback criado com sucesso', 'success');
        return response.data;
      })
      .catch((error) => {
        showToast('Erro', errorParser.parseCreateError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    pageResponse,
    loading,
    getFeedbacks,
    createFeedback,
  };
};

export default useFeedbacks;
