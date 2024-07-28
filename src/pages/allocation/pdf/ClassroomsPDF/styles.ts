import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
  },
  header: {
    color: 'red',
    fontSize: 36,
    fontWeight: 'bold',
    marginHorizontal: 'auto',
    marginVertical: 6,
  },
  subheader: {
    fontSize: 24,
    fontWeight: 'bold',
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
  tableColWeekDay: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColSchedule: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColInfo: {
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