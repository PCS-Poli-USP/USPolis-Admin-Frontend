import { Subject } from 'models/database/subject.models';


export function sortSubjects(A: Subject, B: Subject) {
  if (A.code < B.code) return -1;
  if (A.code > B.code) return 1;
  return 0;
}