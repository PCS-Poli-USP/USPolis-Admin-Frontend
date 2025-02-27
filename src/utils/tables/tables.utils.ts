import { UserResponse } from 'models/http/responses/user.response.models';
import { ClassResponse } from 'models/http/responses/class.response.models';

export function checkUserPermission(
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

export function checkUserPermissionOnClass(
  user: UserResponse | null,
  cls: ClassResponse,
): boolean {
  if (!user) return false;
  const class_allocated_buildings_ids: number[] = [];
  cls.schedules.forEach((schedule) => {
    if (schedule.building_id)
      class_allocated_buildings_ids.push(schedule.building_id);
  });
  return checkUserPermission(user, class_allocated_buildings_ids);
}
