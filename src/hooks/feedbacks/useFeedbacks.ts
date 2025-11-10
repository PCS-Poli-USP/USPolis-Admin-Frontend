/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import useCustomToast from '../useCustomToast';
import useFeedbackService from '../API/services/useFeedbackService';
import { FeedbackResponse } from '../../models/http/responses/feedback.response.models';
import FeedbackErrorParser from './feedbackErrorParser';
import { CreateFeedback } from '../../models/http/requests/feedback.request.models';

const useFeedbacks = () => {
  const service = useFeedbackService();
  const [feedbacks, setFeedbacks] = useState<Array<FeedbackResponse>>([]);
  const [loading, setLoading] = useState(false);

  const errorParser = new FeedbackErrorParser();
  const showToast = useCustomToast();

  const getFeedbacks = useCallback(async () => {
    setLoading(true);
    await service
      .getAll()
      .then((response) => {
        setFeedbacks(response.data);
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
    feedbacks,
    loading,
    getFeedbacks,
    createFeedback,
  };
};

export default useFeedbacks;
