import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import Class from 'models/class.model';
import { useEffect, useState } from 'react';
import ClassesService from 'services/classes.service';
import { WeekDayText } from 'utils/mappers/allocation.mapper';
import { ClassesBySubject } from 'utils/mappers/classes.mapper';

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
  },
  header: {
    fontSize: 12,
    // fontWeight: 'bold', ??
    marginHorizontal: 'auto',
    marginVertical: 12,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    margin: 12,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColClass: {
    width: '10%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColClassroom: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColTime: {
    width: '30%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColProfessor: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    fontSize: 10,
    paddingVertical: 4,
  },
  tableCellHeader: {
    margin: 'auto',
    fontSize: 10,
    paddingVertical: 12,
  },
});

const ClassesPDF = () => {
  const [classesGroupBySubject, setClassesGroupBySubject] = useState<[string, Class[]][]>([]);
  const classesService = new ClassesService();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  function fetchData() {
    classesService.list().then((it) => setClassesGroupBySubject(ClassesBySubject(it.data)));
  }

  return (
    <Document>
      {classesGroupBySubject.map(([subjectCode, classesList]) => (
        <Page style={styles.body} key={subjectCode}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.header}>
                  Disciplina {subjectCode} - {classesList.at(0)?.subject_name}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              {/* <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Disciplina</Text>
              </View> */}
              <View style={styles.tableColClass}>
                <Text style={styles.tableCellHeader}>Turma</Text>
              </View>
              <View style={styles.tableColClassroom}>
                <Text style={styles.tableCellHeader}>Sala</Text>
              </View>
              <View style={styles.tableColTime}>
                <Text style={styles.tableCellHeader}>Horário</Text>
              </View>
              <View style={styles.tableColProfessor}>
                <Text style={styles.tableCellHeader}>Professor</Text>
              </View>
            </View>
            {classesList.map((cl) => (
              <View style={styles.tableRow} key={cl.class_code}>
                {/* <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {cl.subject_code} - {cl.subject_name}
                  </Text>
                </View> */}
                <View style={styles.tableColClass}>
                  <Text style={styles.tableCell}>{parseInt(cl.class_code.slice(-2))}</Text>
                </View>
                <View style={styles.tableColClassroom}>
                  {cl.classrooms?.map((cl, index) => (
                    <Text style={styles.tableCell} key={index}>
                      {cl}
                    </Text>
                  ))}
                </View>
                <View style={styles.tableColTime}>
                  {cl.week_days.map((w, index) => (
                    <Text style={styles.tableCell} key={index}>
                      {WeekDayText(w)} {cl.start_time.at(index)} às {cl.end_time.at(index)}
                    </Text>
                  ))}
                </View>
                <View style={styles.tableColProfessor}>
                  {cl.professors.map((pr, index) => (
                    <Text style={styles.tableCell} key={index}>
                      {pr}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default ClassesPDF;
