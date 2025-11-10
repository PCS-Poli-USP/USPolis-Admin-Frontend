import { UseFormReturn } from 'react-hook-form';
import { BugPriority, BugType } from '../../../../utils/enums/bugReport.enum';

export interface BugReportForm {
  priority: BugPriority;
  type: BugType;
  description: string;
}

export interface BugReportContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<BugReportForm, any, BugReportForm>;
  setFiles: (files: File[]) => void;
}
