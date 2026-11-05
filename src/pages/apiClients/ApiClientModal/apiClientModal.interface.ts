import { ApiClientResponse } from '../../../models/http/responses/apiKey.response.models';
import { ModalProps } from '../../../models/interfaces';

export interface ApiClientForm {
  name: string;
  organization: string;
  contact_name: string;
  contact_email: string;
  description: string;
}

export interface ApiClientModalProps extends ModalProps {
  selectedClient?: ApiClientResponse;
  onSaved: (client: ApiClientResponse, created: boolean) => void;
}
