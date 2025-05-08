export enum ClassType {
  PRACTIC = 'practic',
  THEORIC = 'theoric',
  VINCULATED_THEORIC = 'vinculated_theoric',
  VINCULATED_PRACTIC = 'vinculated_practic',
}

export namespace ClassType {
  const translations: { [key in ClassType]: string } = {
    [ClassType.PRACTIC]: 'Prática',
    [ClassType.THEORIC]: 'Teórica',
    [ClassType.VINCULATED_PRACTIC]: 'Prática Vinculada',
    [ClassType.VINCULATED_THEORIC]: 'Teórica Vinculada',
  };

  export function translate(type: ClassType): string {
    return translations[type];
  }

  export function getValues(): ClassType[] {
    return [
      ClassType.PRACTIC,
      ClassType.THEORIC,
      ClassType.VINCULATED_PRACTIC,
      ClassType.VINCULATED_THEORIC,
    ];
  }
}
