import { HolidayCategoryResponse } from '../../../models/http/responses/holidayCategory.response.models';
import { ModalProps } from '../../../models/interfaces';

export interface HolidayCategoryModalProps extends ModalProps {
  isUpdate: boolean;
  refetch: () => void;
  selectedHolidayCategory?: HolidayCategoryResponse;
}

export interface HolidayCategoryForm {
  name: string;
  id?: number;
  created_by?: string;
}
