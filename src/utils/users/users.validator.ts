import { ClassResponse } from '../../models/http/responses/class.response.models';
import { UserResponse } from '../../models/http/responses/user.response.models';
import CommonValidator from '../../utils/common/common.validator';

export class UsersValidator extends CommonValidator {
  user: UserResponse | null;

  constructor(user: UserResponse | null) {
    super();
    this.user = user;
  }

  static isInvalidName(name: string) {
    return this.isEmptyString(name);
  }
  static isAdmin(user: UserResponse | null) {
    return user ? user.is_admin : false;
  }

  checkUserBuildingPermission(buildings_ids: number[]): boolean {
    if (!this.user) return false;
    if (this.user.is_admin) return true;
    if (!this.user.buildings) return false;
    const userSet = new Set(this.user.buildings.map((b) => b.id));
    const buildingsSet = new Set<number>(buildings_ids);
    // Check if buildingsSet is a subset of userSet
    for (let buildingId of buildingsSet) {
      if (!userSet.has(buildingId)) {
        return false;
      }
    }
    return true;
  }

  private getUserClassroomsIds(): number[] {
    if (!this.user) return [];
    if (this.user.is_admin) return [];
    const user_classrooms_ids: number[] = [];
    this.user.groups.forEach((group) => {
      user_classrooms_ids.push(...group.classroom_ids);
    });
    return user_classrooms_ids;
  }

  private getUserBuildingsIds(): number[] {
    if (!this.user) return [];
    if (this.user.buildings) {
      return this.user.buildings.map((building) => building.id);
    }
    return [];
  }

  checkUserClassroomPermission(classrooms_ids: number[]): boolean {
    if (!this.user) return false;
    if (this.user.is_admin) return true;
    const user_clasrooms_ids = this.getUserClassroomsIds();
    const userSet = new Set(user_clasrooms_ids);
    const classroomsSet = new Set<number>(classrooms_ids);
    return classroomsSet.difference(userSet).size === 0;
  }

  public checkUserClassPermission(cls: ClassResponse): boolean {
    if (!this.user) return false;
    if (this.user.is_admin) return true;
    const class_clasrooms_ids: number[] = [];
    cls.schedules.forEach((schedule) => {
      if (schedule.classroom_id)
        class_clasrooms_ids.push(schedule.classroom_id);
    });
    if (class_clasrooms_ids.length > 0)
      return this.checkUserClassroomPermission(class_clasrooms_ids);
    const user_buildings_ids = this.getUserBuildingsIds();
    const userSet = new Set(user_buildings_ids);
    const buildingsSet = new Set<number>(cls.subject_building_ids);
    return userSet.intersection(buildingsSet).size > 0;
  }

  checkUserRestrictedPermission() {
    if (!this.user) return false;
    if (this.user.is_admin) return true;
    if (!this.user.buildings) return false;
    return true;
  }
}
