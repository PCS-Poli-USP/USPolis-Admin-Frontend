/* eslint-disable @typescript-eslint/no-namespace */
// Mirrors server/utils/enums/search_entity_type.py
export enum SearchEntityType {
  SUBJECT = 'subject',
  CLASS = 'class',
  CLASSROOM = 'classroom',
  BUILDING = 'building',
  PROFESSOR = 'professor',
  // Reservations (one document per reservation, typed by its child)
  EXAM = 'exam',
  EVENT = 'event',
  // Only meetings whose title mentions "monitoria" are indexed
  MEETING = 'meeting',
}

export namespace SearchEntityType {
  const singular: { [key in SearchEntityType]: string } = {
    [SearchEntityType.SUBJECT]: 'Disciplina',
    [SearchEntityType.CLASS]: 'Turma',
    [SearchEntityType.CLASSROOM]: 'Sala',
    [SearchEntityType.BUILDING]: 'Prédio',
    [SearchEntityType.PROFESSOR]: 'Professor(a)',
    [SearchEntityType.EXAM]: 'Prova',
    [SearchEntityType.EVENT]: 'Evento',
    [SearchEntityType.MEETING]: 'Reunião',
  };

  const plural: { [key in SearchEntityType]: string } = {
    [SearchEntityType.SUBJECT]: 'Disciplinas',
    [SearchEntityType.CLASS]: 'Turmas',
    [SearchEntityType.CLASSROOM]: 'Salas',
    [SearchEntityType.BUILDING]: 'Prédios',
    [SearchEntityType.PROFESSOR]: 'Professores',
    [SearchEntityType.EXAM]: 'Provas',
    [SearchEntityType.EVENT]: 'Eventos',
    [SearchEntityType.MEETING]: 'Reuniões',
  };

  export function translate(type: SearchEntityType): string {
    return singular[type];
  }

  export function translatePlural(type: SearchEntityType): string {
    return plural[type];
  }

  export function values(): SearchEntityType[] {
    return [
      SearchEntityType.SUBJECT,
      SearchEntityType.CLASS,
      SearchEntityType.CLASSROOM,
      SearchEntityType.BUILDING,
      SearchEntityType.PROFESSOR,
      SearchEntityType.EXAM,
      SearchEntityType.EVENT,
      SearchEntityType.MEETING,
    ];
  }

  export function isValid(value: string): value is SearchEntityType {
    return (values() as string[]).includes(value);
  }
}
