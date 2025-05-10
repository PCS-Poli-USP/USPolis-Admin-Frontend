import { ClassResponse } from '../../models/http/responses/class.response.models';

export function ClassesBySubject(classes: ClassResponse[]) {
  const mapData = classes.reduce((group: Map<string, ClassResponse[]>, cl) => {
    const { subject_code } = cl;
    const subjectClasses = group.get(subject_code);
    if (subjectClasses) {
      group.set(subject_code, subjectClasses.concat(cl));
    } else {
      group.set(subject_code, [cl]);
    }

    return group;
  }, new Map<string, ClassResponse[]>());

  // order by class_code
  mapData.forEach((value) =>
    value.sort((a, b) => a.code.localeCompare(b.code)),
  );

  // Sort by subject
  return Array.from(mapData).sort(([subjectA], [subjectB]) =>
    subjectA.localeCompare(subjectB),
  );
}
