import { HolidayResponse } from '../../../models/http/responses/holiday.response.models';
import { HolidayCategoryResponse } from '../../../models/http/responses/holidayCategory.response.models';
import { ModalProps } from '../../../models/interfaces';

export interface HolidayModalProps extends ModalProps {
  categories: HolidayCategoryResponse[];
  category?: HolidayCategoryResponse;
  isUpdate: boolean;
  refetch: () => void;
  selectedHoliday?: HolidayResponse;
}

export interface HolidayForm {
  category_id: number;
  date: string;
  name: string;
}
