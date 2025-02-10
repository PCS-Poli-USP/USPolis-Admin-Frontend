import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './styles';
import { ClassResponse } from 'models/http/responses/class.response.models';
import { ReservationResponse } from 'models/http/responses/reservation.response.models';
import {
  getClassroomOccupationMap,
  getTimeRanges,
  OCCUPATION_EMPTY,
  WeekDayOccupationMap,
} from '../utils';
import { classNumberFromClassCode } from 'utils/classes/classes.formatter';
import { getScheduleString } from 'utils/schedules/schedule.formatter';

interface ClassroomPDFProps {
  classes: ClassResponse[];
  reservations: ReservationResponse[];
}

const ClassroomsPDF = ({ classes, reservations }: ClassroomPDFProps) => {
  const ranges = getTimeRanges(7);
  const map = getClassroomOccupationMap(classes);
  const group = Array.from(map.entries());

  function getUniqueClassesFromClassroomMap(
    map: [string, WeekDayOccupationMap],
  ) {
    const days = Array.from(map[1].entries());
    const unique = new Set<string>();
    days.forEach((day) => {
      const values = Array.from(day[1].values());
      values.forEach((value) => unique.add(value));
    });
    return classes.filter((cls) =>
      unique.has(`${cls.subject_code} T${classNumberFromClassCode(cls.code)}`),
    );
  }
  return (
    <Document>
      {group.map((classroomMap) => (
        <Page style={styles.body} key={classroomMap[0]}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.header}>
                  Sala {classroomMap[0]} {'\n'}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColSchedule}>
                <Text style={styles.tableCellHeader}>Horários</Text>
              </View>

              <View style={styles.tableColWeekDay}>
                <Text style={styles.tableCellHeader}>Segunda</Text>
              </View>

              <View style={styles.tableColWeekDay}>
                <Text style={styles.tableCellHeader}>Terça</Text>
              </View>

              <View style={styles.tableColWeekDay}>
                <Text style={styles.tableCellHeader}>Quarta</Text>
              </View>

              <View style={styles.tableColWeekDay}>
                <Text style={styles.tableCellHeader}>Quinta</Text>
              </View>

              <View style={styles.tableColWeekDay}>
                <Text style={styles.tableCellHeader}>Sexta</Text>
              </View>
            </View>
            {ranges.map((time, index) => {
              const days = Array.from(classroomMap[1]);
              return (
                <View
                  style={styles.tableRow}
                  key={classroomMap[0] + index.toString()}
                >
                  <View style={styles.tableColSchedule}>
                    <Text style={styles.tableCell}>
                      {time[0]} {time[1]}
                    </Text>
                  </View>
                  {days.map((day, idx) => {
                    const value = Array.from(day[1])[index][1] as string;
                    return (
                      <View
                        style={styles.tableColWeekDay}
                        key={classroomMap[0] + day[0] + index}
                      >
                        <Text
                          style={
                            value === OCCUPATION_EMPTY
                              ? styles.tableCellEmpty
                              : styles.tableCell
                          }
                        >
                          {value}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.footer}>Detalhes {'\n'}</Text>
              </View>
            </View>
            {getUniqueClassesFromClassroomMap(classroomMap).map((cls) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {cls.subject_code} T{classNumberFromClassCode(cls.code)} {cls.schedules.map((schedule) => (`${getScheduleString(
                  schedule,
                )} (${schedule.start_time.substring(
                  0,
                  5,
                )} ~ ${schedule.end_time.substring(0, 5)})`)).join(', ')}
                </Text>
   
              </View>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default ClassroomsPDF;
