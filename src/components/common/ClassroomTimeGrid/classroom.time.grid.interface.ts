import { ClassroomFullResponse } from 'models/http/responses/classroom.response.models';
import { ModalProps } from 'models/interfaces';

export interface ClassroomTimeGridProps extends ModalProps {
  clasroom?: ClassroomFullResponse;
}

export interface ClassroomEventExtendedProps {
  type: string;
  name: string;
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
