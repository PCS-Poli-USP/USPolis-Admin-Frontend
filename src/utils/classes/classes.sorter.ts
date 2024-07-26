import { ClassResponse, ClassWithOccurrencesResponse } from 'models/http/responses/class.response.models';

export function sortClassResponse(A: ClassResponse | ClassWithOccurrencesResponse, B: ClassResponse | ClassWithOccurrencesResponse) {
  if (A.subject_code < B.subject_code) return -1;
  if (A.subject_code > B.subject_code) return 1;
  if (A.code < B.code) return -1;
  if (A.code > B.code) return 1;
  return 0;
}
