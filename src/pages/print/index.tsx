import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { Heading } from '@chakra-ui/react';
import { SavedClassroomCalendarPage } from 'pages/allocation/pdf/ClassroomsCalendarPDF/classrooms.calendar.pdf';
import ClassroomCalendarPage from 'pages/print/classroom.calendar.page';

const ClassroomCalendarPrintPage = () => {
  const navigate = useNavigate();
  const [calendarsData, setCalendarsData] = useState<
    SavedClassroomCalendarPage[]
  >([]);

  useEffect(() => {
    const storedCalendars = localStorage.getItem('savedCalendars');
    if (storedCalendars) {
      setCalendarsData(JSON.parse(storedCalendars));
      setTimeout(() => {
        window.print();
        localStorage.removeItem('calendarsToPrint');
        navigate(-1);
      }, 1000);
    } else {
      alert('Nenhum calendário encontrado para imprimir!');
      navigate(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {calendarsData.length > 0 ? (
        calendarsData.map((data) => (
          <ClassroomCalendarPage
            key={data.index}
            classroom={data.classroom}
            events={data.events}
            index={data.index}
          />
        ))
      ) : (
        <Heading size={'lg'} w={'full'} textAlign={'center'}>
          Carregando PDF...
        </Heading>
      )}
    </div>
  );
};

export default ClassroomCalendarPrintPage;
