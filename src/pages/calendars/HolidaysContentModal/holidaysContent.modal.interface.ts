import { HolidayCategoryResponse } from '../../../models/http/responses/holidayCategory.response.models';
import { UserResponse } from '../../../models/http/responses/user.response.models';
import { ModalProps } from '../../../models/interfaces';

export interface HolidaysContentModalProps extends ModalProps {
  isLoading: boolean;
  loggedUser: UserResponse | null;
  categories: HolidayCategoryResponse[];
  refetch: () => void;
}
