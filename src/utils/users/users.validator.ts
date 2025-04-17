import { ClassResponse } from '../../models/http/responses/class.response.models';
import { UserResponse } from '../../models/http/responses/user.response.models';
import CommonValidator from '../../utils/common/common.validator';

export class UsersValidator extends CommonValidator {
  static isInvalidName(name: string) {
    return this.isEmptyString(name);
  }
  static isAdmin(user: UserResponse | null) {
    return user ? user.is_admin : false;
  }

  static checkUserBuildingPermission(
    user: UserResponse | null,
    buildings_ids: number[],
  ): boolean {
    if (!user) return false;
    if (user.is_admin) return true;
    if (!user.buildings) return false;
    const userSet = new Set(user.buildings.map((b) => b.id));
    const buildingsSet = new Set<number>(buildings_ids);
    // Check if buildingsSet is a subset of userSet
    for (let buildingId of buildingsSet) {
      if (!userSet.has(buildingId)) {
        return false;
      }
    }
    return true;
  }
  static checkUserPermissionOnClass(
    user: UserResponse | null,
    cls: ClassResponse,
  ): boolean {
    if (!user) return false;
    const class_allocated_buildings_ids: number[] = [];
    cls.schedules.forEach((schedule) => {
      if (schedule.building_id)
        class_allocated_buildings_ids.push(schedule.building_id);
    });
    return this.checkUserBuildingPermission(
      user,
      class_allocated_buildings_ids,
    );
  }

  static checkUserRestrictedPermission(user: UserResponse | null) {
    if (!user) return false;
    if (user.is_admin) return true;
    if (!user.buildings) return false;
    return true;
  }
}
