export interface HolidayResponse {
  id: number;
  category: string;
  date: string;
  updated_at: string;
  created_by: string;
}

export interface HolidayUnfetchResponse {
  id: number;
  date: string;
  update_at: string;
  category_id: number;
  created_by_id: number;
}
