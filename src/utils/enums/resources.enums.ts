/* eslint-disable @typescript-eslint/no-namespace */
export enum Resource {
  CLASSROOM = 'CLASSROOM',
  COURSE = 'COURSE',
}

export namespace Resource {
  export function getValues(): Resource[] {
    return [Resource.CLASSROOM, Resource.COURSE];
  }

  const translations: Record<Resource, string> = {
    [Resource.CLASSROOM]: 'Salas de Aula',
    [Resource.COURSE]: 'Cursos',
  };

  export function translate(resource: Resource): string {
    return translations[resource] || 'Desconecido';
  }
}
