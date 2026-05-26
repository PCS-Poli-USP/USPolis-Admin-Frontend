import { Resource } from './resources.enums';

/* eslint-disable @typescript-eslint/no-namespace */
const BaseAction = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

type BaseAction = (typeof BaseAction)[keyof typeof BaseAction];

export const ClassroomAction = {
  ...BaseAction,
  ALLOCATE: 'allocate',
  RESERVE: 'reserve',
} as const;

export type ClassroomAction =
  (typeof ClassroomAction)[keyof typeof ClassroomAction];

export const CourseAction = {
  ...BaseAction,
} as const;

export type CourseAction = (typeof CourseAction)[keyof typeof CourseAction];

export type PermissionAction = ClassroomAction | CourseAction;

export namespace PermissionAction {
  export function getValues(resource: Resource): PermissionAction[] {
    switch (resource) {
      case Resource.CLASSROOM:
        return Object.values(ClassroomAction) as PermissionAction[];
      case Resource.COURSE:
        return Object.values(CourseAction) as PermissionAction[];
      default:
        return [];
    }
  }

  export function translateBaseAction(action: BaseAction): string {
    switch (action) {
      case BaseAction.CREATE:
        return 'Criar';
      case BaseAction.READ:
        return 'Visualizar';
      case BaseAction.UPDATE:
        return 'Atualizar';
      case BaseAction.DELETE:
        return 'Deletar';
      default:
        return 'Desconecido';
    }
  }

  export function translateClassroomAction(action: ClassroomAction): string {
    switch (action) {
      case ClassroomAction.ALLOCATE:
        return 'Alocar';
      case ClassroomAction.RESERVE:
        return 'Reservar';
      default:
        return translateBaseAction(action as BaseAction);
    }
  }

  export function translateCourseAction(action: CourseAction): string {
    return translateBaseAction(action as BaseAction);
  }

  export function translate(
    action: PermissionAction,
    resource: Resource,
  ): string {
    switch (resource) {
      case Resource.CLASSROOM:
        return translateClassroomAction(action as ClassroomAction);
      case Resource.COURSE:
        return translateCourseAction(action as CourseAction);
      default:
        return 'Desconhecido';
    }
  }

  export function canHaveAllResources(
    action: PermissionAction,
    resource: Resource,
  ): boolean {
    switch (resource) {
      case Resource.CLASSROOM:
        return (
          action === ClassroomAction.CREATE || action === ClassroomAction.READ
        );
      case Resource.COURSE:
        return true; // Todas as ações de curso podem ser aplicadas a todos os cursos
      default:
        return false;
    }
  }
}
