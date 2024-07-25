import { Document, Page, Text, View } from '@react-pdf/renderer';
import { ClassesBySubject } from 'utils/mappers/classes.mapper';
import { styles } from './styles';
import useClasses from 'hooks/useClasses';
import { AllocationEnum } from 'utils/enums/allocation.enum';
import { getScheduleTime } from 'utils/schedules/schedule.formatter';

const ClassesPDF = () => {
  const { classes } = useClasses();

  return (
    <Document>
      {ClassesBySubject(classes).map(([subjectCode, classesList]) => (
        <Page style={styles.body} key={subjectCode}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.header}>
                  {subjectCode} {'\n'}
                </Text>
                <Text style={styles.subheader}>
                  {classesList.at(0)?.subject_name}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColClass}>
                <Text style={styles.tableCellHeader}>Turma</Text>
              </View>
              <View style={styles.tableColClassroom}>
                <Text style={styles.tableCellHeader}>Sala</Text>
              </View>
              <View style={styles.tableColTime}>
                <Text style={styles.tableCellHeader}>Horários</Text>
              </View>
              <View style={styles.tableColProfessor}>
                <Text style={styles.tableCellHeader}>Professores</Text>
              </View>
            </View>
            {classesList.map((cl) => (
              <View style={styles.tableRow} key={cl.code}>
                <View style={styles.tableColClass}>
                  <Text style={styles.tableCell}>{cl.code.slice(-2)}</Text>
                </View>
                <View style={styles.tableColClassroom}>
                  {cl.schedules.map((schedule, index) => (
                    <Text style={styles.tableCell} key={index}>
                      {schedule.classroom
                        ? schedule.classroom
                        : AllocationEnum.UNALLOCATED}
                    </Text>
                  ))}
                </View>
                <View style={styles.tableColTime}>
                  {cl.schedules.map((schedule, index) => (
                    <Text style={styles.tableCell} key={index}>
                      {getScheduleTime(schedule)}
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
