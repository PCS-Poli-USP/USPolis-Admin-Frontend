/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import useExamsService from '../API/services/useExamsService';
import { CreateExam } from '../../models/http/requests/exam.request.models';
import {
  ExamEventResponse,
  ExamResponse,
} from '../../models/http/responses/exam.response.models';
import ExamErrorParser from './examErrorParser';
import useCustomToast from '../useCustomToast';

const useExams = () => {
  const service = useExamsService();
  const [exams, setExams] = useState<Array<ExamResponse>>([]);
  const [loading, setLoading] = useState(false);

  const errorParser = new ExamErrorParser();
  const showToast = useCustomToast();

  const getExams = useCallback(async (start?: string, end?: string) => {
    setLoading(true);
    await service
      .get(start, end)
      .then((response) => {
        setExams(response.data);
      })
      .catch((error) => {
        showToast('Erro', errorParser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getExamsBySubject = useCallback(
    async (subject_id: number, start?: string, end?: string) => {
      setLoading(true);
      await service
        .getBySubjectId(subject_id, start, end)
        .then((response) => {
          setExams(response.data);
        })
        .catch((error) => {
          showToast('Erro', errorParser.parseGetError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [],
  );

  const getExamsEvents = useCallback(async (start?: string, end?: string) => {
    setLoading(true);
    let data: ExamEventResponse[] = [];
    await service
      .getEvents(start, end)
      .then((response) => {
        data = response.data;
      })
      .catch((error) => {
        showToast('Erro', errorParser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
    return data;
  }, []);

  const createExam = useCallback(async (data: CreateExam) => {
    setLoading(true);
    await service
      .create(data)
      .then((response) => {
        showToast('Sucesso', 'Prova criada com sucesso', 'success');
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
    exams,
    loading,
    getExams,
    getExamsBySubject,
    getExamsEvents,
    createExam,
  };
};

export default useExams;
