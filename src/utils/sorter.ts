import Class from 'models/class.model';
import { Building } from 'models/building.model';

export function sortClasses(a: Class, b: Class) {
  if (a.subject_code === b.subject_code) {
    if (a.subject_name < b.subject_name) return -1;
    else if (a.subject_name === b.subject_name) {
      if (a.class_code < b.class_code) return -1;
      else if (a.class_code === b.class_code) return 0;
      else return 1;
    }
    return 1;
  } else if (a.subject_code < b.subject_code) return -1;
  else return 1;
}

export function sortBuilding(a: Building, b: Building) {
  if (a.name < b.name) return -1;
  else if (a.name > b.name) return 1;
  return 0;
}
