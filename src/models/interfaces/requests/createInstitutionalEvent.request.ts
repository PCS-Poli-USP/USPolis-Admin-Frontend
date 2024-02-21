export interface CreateInstitutionalEventRequest {
  building?: string | null;
  classroom?: string | null;
  location?: string | null;
  category: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  external_link?: string;
  title: string;
}
