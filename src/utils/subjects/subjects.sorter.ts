import { SubjectResponse } from "models/http/responses/subject.response.models";

export function sortSubjectsResponse(A: SubjectResponse, B: SubjectResponse) {
  if (A.code < B.code) return -1;
  if (A.code > B.code) return 1;
  return 0;
}
