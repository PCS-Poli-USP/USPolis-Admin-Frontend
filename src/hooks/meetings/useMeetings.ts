/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import useCustomToast from '../useCustomToast';
import { MeetingResponse } from '../../models/http/responses/meeting.response.models';
import { CreateMeeting } from '../../models/http/requests/meeting.request.models';
import useMeetingsService from '../API/services/useMeetingsService';
import MeetingErrorParser from './meetingErrorParser';

const useMeetings = () => {
  const service = useMeetingsService();
  const [meetings, setMeetings] = useState<Array<MeetingResponse>>([]);
  const [loading, setLoading] = useState(false);

  const errorParser = new MeetingErrorParser();
  const showToast = useCustomToast();

  const getMeetings = useCallback(async (start?: string, end?: string) => {
    setLoading(true);
    await service
      .get(start, end)
      .then((response) => {
        setMeetings(response.data);
      })
      .catch((error) => {
        showToast('Erro', errorParser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const createMeeting = useCallback(async (data: CreateMeeting) => {
    setLoading(true);
    await service
      .create(data)
      .then((response) => {
        showToast('Sucesso', 'Reunião criada com sucesso', 'success');
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
    meetings,
    loading,
    getMeetings,
    createMeeting,
  };
};

export default useMeetings;
