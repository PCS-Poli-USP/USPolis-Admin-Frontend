import { ClassroomFullResponse } from 'models/http/responses/classroom.response.models';
import { ModalProps } from 'models/interfaces';

export interface ClassroomTimeGridProps extends ModalProps {
  classroom?: ClassroomFullResponse;
  preview: ClassroomPreview;
}

export interface ClassroomEventExtendedProps {
  type: string;
  name: string;
  start: string;
  end: string;
}

export interface ClassroomPreview {
  title: string;
  dates: string[];
  start_time: string;
  end_time: string;
}

export interface ClassroomEvent {
  title: string;
  date: string;
  start: string; // Must be YYYY-MM-DDTHH:mm:ss
  end: string; // Must be YYYY-MM-DDTHH:mm:ss
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps: ClassroomEventExtendedProps;
}
