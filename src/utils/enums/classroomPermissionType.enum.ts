/* eslint-disable @typescript-eslint/no-namespace */
export enum ClassroomPermissionType {
  VIEW = 'view',
  RESERVE = 'reserve',
}

export namespace ClassroomPermissionType {
  const translations: { [key in ClassroomPermissionType]: string } = {
    [ClassroomPermissionType.VIEW]: 'Visualizar',
    [ClassroomPermissionType.RESERVE]: 'Reservar',
  };

  export function translate(type: ClassroomPermissionType): string {
    return translations[type];
  }

  export function getValues(): ClassroomPermissionType[] {
    return [ClassroomPermissionType.VIEW, ClassroomPermissionType.RESERVE];
  }
}
