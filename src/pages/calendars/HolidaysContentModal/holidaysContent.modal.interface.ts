import { HolidayCategoryResponse } from "models/http/responses/holidayCategory.response.models";
import { ModalProps } from "models/interfaces";

export interface HolidaysContentModalProps extends ModalProps {
  isLoading: boolean;
  categories: HolidayCategoryResponse[];
  refetch: () => void;
}