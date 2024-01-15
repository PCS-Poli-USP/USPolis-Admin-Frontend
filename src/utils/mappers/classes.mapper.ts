import Class from 'models/class.model';

export function ClassesBySubject(classes: Class[]) {
  const mapData = classes.reduce((group: Map<string, Class[]>, cl) => {
    const { subject_code } = cl;
    const classroomClasses = group.get(subject_code);
    classroomClasses ? group.set(subject_code, classroomClasses.concat(cl)) : group.set(subject_code, [cl]);

    return group;
  }, new Map());

  // order by class_code
  mapData.forEach((value) => value.sort((a, b) => a.class_code.localeCompare(b.class_code)));

  return Array.from(mapData).sort(([subjectA, _dataA], [subjectB, _dataB]) => subjectA.localeCompare(subjectB));
}