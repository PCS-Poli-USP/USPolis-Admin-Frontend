export function classNumberFromClassCode(classCode: string): string {
    /*  VALID INPUTS:
    *   "202501"                    - only numbers
    *   "202501 (Disciplina anual)" - numbers on start, separated by blankspace from the rest
    */  

    const onlyCode = classCode.split(" ")[0]
    return onlyCode.slice(-2);
}