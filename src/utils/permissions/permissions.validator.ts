import CommonValidator from '../common/common.validator';
import { PermissionAction } from '../enums/actions.enums';
import { Resource } from '../enums/resources.enums';

export default class PermissionsValidator extends CommonValidator {
  static isValidResource(value: string): boolean {
    return Resource.getValues().includes(value as Resource);
  }
  static isValidAction(value: string, resource: Resource): boolean {
    const actions = PermissionAction.getValues(resource);
    return actions.includes(value as PermissionAction);
  }

  static isValidActions(values: string[], resource: Resource): boolean {
    const actions = PermissionAction.getValues(resource);
    return values.every((value) => actions.includes(value as PermissionAction));
  }

  static actionCanHaveAllResources(
    action: PermissionAction,
    resource: Resource,
  ): boolean {
    return PermissionAction.canHaveAllResources(action, resource);
  }

  static actionsCanHaveAllResources(
    actions: PermissionAction[],
    resource: Resource,
  ): boolean {
    return actions.every((action) =>
      PermissionAction.canHaveAllResources(action, resource),
    );
  }
}
