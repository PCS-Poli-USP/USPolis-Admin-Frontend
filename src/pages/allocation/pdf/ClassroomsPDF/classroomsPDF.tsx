import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './styles';
import { getScheduleWithTimeString } from 'utils/schedules/schedule.formatter';
import { ClassFullResponse } from 'models/http/responses/class.response.models';
import { ReservationFullResponse } from 'models/http/responses/reservation.response.models';
import { WeekDay } from 'utils/enums/weekDays.enum';
import { getSchedulesGroupedByClassroom } from '../utils';

interface ClassroomPDFProps {
  classes: ClassFullResponse[];
  reservations: ReservationFullResponse[];
}

const ClassroomsPDF = ({ classes, reservations }: ClassroomPDFProps) => {
  const group = getSchedulesGroupedByClassroom(classes, reservations);
  return (
    <Document>
      {group.map((classroomMap) => (
        <Page style={styles.body} key={classroomMap[0]}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.header}>
                  {classroomMap[0]} {'\n'}
                </Text>
                <Text style={styles.subheader}>{`Sala - ${classroomMap[1]}`}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColWeekDay}>
                <Text style={styles.tableCellHeader}>Dia da semana</Text>
              </View>
              <View style={styles.tableColSchedule}>
                <Text style={styles.tableCellHeader}>Horários</Text>
              </View>
              <View style={styles.tableColInfo}>
                <Text style={styles.tableCellHeader}>Informações</Text>
              </View>
            </View>
            {classroomMap[2].map((scheduleMap) => (
              <View style={styles.tableRow} key={scheduleMap[1].id}>
                <View style={styles.tableColWeekDay}>
                  <Text style={styles.tableCell}>
                    {scheduleMap[1].week_day !== undefined
                      ? WeekDay.translate(scheduleMap[1].week_day)
                      : 'Não possui'}
                  </Text>
                </View>
                <View style={styles.tableColSchedule}>
                  <Text style={styles.tableCell}>
                    {getScheduleWithTimeString(scheduleMap[1])}
                  </Text>
                </View>
                <View style={styles.tableColInfo}>
                  <Text style={styles.tableCell}>{scheduleMap[0]}</Text>
                </View>
              </View>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default ClassroomsPDF;
