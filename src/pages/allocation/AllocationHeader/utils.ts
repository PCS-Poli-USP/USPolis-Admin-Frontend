export function getStartOfSemester() {
  const today = new Date();
  const semesterStart = new Date(today.getFullYear(), 0, 1);
  if (today.getMonth() >= 7) {
    semesterStart.setMonth(6, 21);
  }
  return semesterStart.toISOString().split('T')[0];
}

export function getEndOfSemester() {
  const today = new Date();
  const semesterEnd = new Date(today.getFullYear(), 11, 31);
  if (today.getMonth() < 7) {
    semesterEnd.setMonth(6, 20);
  }
  return semesterEnd.toISOString().split('T')[0];
}
