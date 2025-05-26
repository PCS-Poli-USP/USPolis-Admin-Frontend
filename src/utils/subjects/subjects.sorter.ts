import { SubjectResponse } from '../../models/http/responses/subject.response.models';

export function sortSubjectsResponse(A: SubjectResponse, B: SubjectResponse) {
  if (A.code < B.code) return -1;
  if (A.code > B.code) return 1;
  return 0;
}

export function sortProfessors(a: string, b: string) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}
