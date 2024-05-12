export interface InstitutionalEvent {
  _id: string;
  building: string | null;
  classroom: string | null;
  location: string | null;
  category: string;
  created_at: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  external_link: string;
  title: string;
}
