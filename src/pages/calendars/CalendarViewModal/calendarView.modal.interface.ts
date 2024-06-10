import { CalendarResponse } from "models/http/responses/calendar.responde.models";
import { ModalProps } from "models/interfaces";

export interface CalendarViewModalProps extends ModalProps{
   calendar?: CalendarResponse
}