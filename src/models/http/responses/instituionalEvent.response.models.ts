export interface InstitutionalEventResponse {
  id: number;
  title: string;
  description: string;
  category: string;
  start: string;
  end: string;
  likes: number;
  created_at: string;
  location?: string;
  building?: string;
  classroom?: string;
  external_link?: string;
}
