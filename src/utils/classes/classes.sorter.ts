import { ClassResponseBase } from '../../models/http/responses/class.response.models';

export function sortClassResponse(A: ClassResponseBase, B: ClassResponseBase) {
  if (A.subject_code < B.subject_code) return -1;
  if (A.subject_code > B.subject_code) return 1;
  if (A.code < B.code) return -1;
  if (A.code > B.code) return 1;
  return 0;
}
