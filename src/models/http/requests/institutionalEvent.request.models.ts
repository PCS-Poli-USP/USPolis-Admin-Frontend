export interface CreateInstitutionalEvent {
  title: string;
  description: string;
  category: string;
  start: string;
  end: string;
  location?: string;
  building?: string;
  classroom?: string;
  external_link?: string;
}

export interface UpdateInstitutionalEvent extends CreateInstitutionalEvent {}
