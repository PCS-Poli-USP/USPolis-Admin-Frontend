import { UseFormReturn } from 'react-hook-form';

export interface FeedbackForm {
  title: string;
  message: string;
}

export interface FeedbackContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<FeedbackForm, any, FeedbackForm>;
  isMobile: boolean;
}
