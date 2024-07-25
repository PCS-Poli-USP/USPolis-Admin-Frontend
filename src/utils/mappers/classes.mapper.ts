import Class, { SClass } from 'models/common/class.model';
import { ClassResponse } from 'models/http/responses/class.response.models';

export function ClassesBySubject(classes: ClassResponse[]) {
  const mapData = classes.reduce((group: Map<string, ClassResponse[]>, cl) => {
    const { subject_code } = cl;
    const subjectClasses = group.get(subject_code);
    subjectClasses
      ? group.set(subject_code, subjectClasses.concat(cl))
      : group.set(subject_code, [cl]);

    return group;
  }, new Map());

  // order by class_code
  mapData.forEach((value) =>
    value.sort((a, b) => a.code.localeCompare(b.code)),
  );

  // Sort by subject
  return Array.from(mapData).sort(([subjectA, _dataA], [subjectB, _dataB]) =>
    subjectA.localeCompare(subjectB),
  );
}

export function SClassesBySubject(classes: Class[]) {
  const mapData = classes.reduce((group: Map<string, SClass[]>, cl) => {
    const { subject_code } = cl;
    const classroomClasses = group.get(subject_code);
    classroomClasses
      ? group.set(
          subject_code,
          classroomClasses.concat({ ...cl, selected: false }),
        )
      : group.set(subject_code, [{ ...cl, selected: false }]);

    return group;
  }, new Map());

  // order by class_code
  mapData.forEach((value) =>
    value.sort((a, b) => a.class_code.localeCompare(b.class_code)),
  );

  return Array.from(mapData).sort(([subjectA, _dataA], [subjectB, _dataB]) =>
    subjectA.localeCompare(subjectB),
  );
}
