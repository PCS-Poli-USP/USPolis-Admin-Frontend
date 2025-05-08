import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import { InstitutionalEventResponse } from '../../../models/http/responses/instituionalEvent.response.models';
import { ModalProps } from '../../../models/interfaces';

export interface InstitutionalEventForm {
  building?: string;
  category: string;
  classroom?: string;
  description: string;
  end: string;
  start: string;
  external_link?: string;
  location?: string;
  title: string;
}

export interface InstitutionalEventModalProps extends ModalProps {
  selectedEvent: InstitutionalEventResponse | undefined;
  refetch: () => Promise<void>;
  buildings: BuildingResponse[];
}
