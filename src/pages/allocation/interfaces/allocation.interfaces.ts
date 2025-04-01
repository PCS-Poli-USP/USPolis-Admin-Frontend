import {
  EventResponse,
  ResourceResponse,
} from 'models/http/responses/allocation.response.models';

export interface Resource extends ResourceResponse {
  eventColor?: string;
  eventBackgroundColor?: string;
  eventBorderColor?: string;
  eventTextColor?: string;
}

// See https://fullcalendar.io/docs/event-parsing
export interface Event extends EventResponse {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}
