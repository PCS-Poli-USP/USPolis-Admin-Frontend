import {
  CreateHolidayCategory,
  UpdateHolidayCategory,
} from 'models/http/requests/holidayCategory.request.models';
import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import { ModalProps } from 'models/interfaces';

export interface HolidayCategoryModalProps extends ModalProps {
  isUpdate: boolean;
  onCreate: (data: CreateHolidayCategory) => void;
  onUpdate: (id: string, data: UpdateHolidayCategory) => void;
  selectedHolidayCategory?: HolidayCategoryResponse;
}

export interface HolidayCategoryForm {
  name: string;
  id?: string;
  created_by?: string;
}
