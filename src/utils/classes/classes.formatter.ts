export function classNumberFromClassCode(classCode: string): string {
  /*  VALID INPUTS:
   *   "2025101"                    - only numbers
   *   "2025101 (Disciplina anual)" - numbers on start, separated by blankspace from the rest
   */
  const onlyCode = classCode.split(' ')[0];
  return onlyCode.slice(-2);
}
