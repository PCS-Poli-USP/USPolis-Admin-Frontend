import {
  CreateHoliday,
  UpdateHoliday,
} from 'models/http/requests/holiday.request.models';
import { HolidayResponse } from 'models/http/responses/holiday.response.models';
import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import { ModalProps } from 'models/interfaces';

export interface HolidayModalProps extends ModalProps {
  categories: HolidayCategoryResponse[];
  isUpdate: boolean;
  onCreate: (data: CreateHoliday) => void;
  onUpdate: (id: number, data: UpdateHoliday) => void;
  selectedHoliday?: HolidayResponse;
}

export interface HolidayForm {
  category_id: number;
  date: string;
}
