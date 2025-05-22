import {
  CreateCalendar,
  UpdateCalendar,
} from '../../../models/http/requests/calendar.request.models';
import { CalendarResponse } from '../../../models/http/responses/calendar.responde.models';
import { HolidayCategoryResponse } from '../../../models/http/responses/holidayCategory.response.models';
import { ModalProps } from '../../../models/interfaces';

export interface CalendarModalProps extends ModalProps {
  isUpdate: boolean;
  categories: HolidayCategoryResponse[];
  onCreate: (data: CreateCalendar) => void;
  onUpdate: (id: number, data: UpdateCalendar) => void;
  selectedCalendar?: CalendarResponse;
}

export interface CalendarForm {
  name: string;
  year: number;
  categories_ids: number[];
}
