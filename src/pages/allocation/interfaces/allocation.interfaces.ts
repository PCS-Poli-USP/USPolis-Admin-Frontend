import {
  AllocationEventResponse,
  AllocationResourceResponse,
} from '../../../models/http/responses/allocation.response.models';

export interface Resource extends AllocationResourceResponse {
  eventColor?: string;
  eventBackgroundColor?: string;
  eventBorderColor?: string;
  eventTextColor?: string;
}

// See https://fullcalendar.io/docs/event-parsing
export interface Event extends AllocationEventResponse {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}
