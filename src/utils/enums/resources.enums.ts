/* eslint-disable @typescript-eslint/no-namespace */
export enum Resource {
  CLASSROOM = 'classroom',
  COURSE = 'course',
  BUILDING = 'building',
}

export namespace Resource {
  export function getValues(): Resource[] {
    return [Resource.CLASSROOM, Resource.COURSE, Resource.BUILDING];
  }

  const translations: Record<Resource, string> = {
    [Resource.CLASSROOM]: 'Salas de Aula',
    [Resource.COURSE]: 'Cursos',
    [Resource.BUILDING]: 'Prédios',
  };

  export function translate(resource: Resource): string {
    return translations[resource] || 'Desconecido';
  }

  export function getIcon(resource: Resource): string {
    return icons[resource] || '❓';
  }

  const icons: Record<Resource, string> = {
    [Resource.CLASSROOM]: '🏫',
    [Resource.COURSE]: '📚',
    [Resource.BUILDING]: '🏢',
  };
}
