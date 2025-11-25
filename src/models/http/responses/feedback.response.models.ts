export interface FeedbackResponse {
  id: number;
  title: string;
  message: string;
  user_id: number;
  user_email: string;
  user_name: string;
  user_picture_url?: string;
  created_at: string;
}
