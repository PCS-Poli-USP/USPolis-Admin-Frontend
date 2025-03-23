import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const ClassroomCalendarPrintPage = () => {
  const navigate = useNavigate();
  const [calendarsHtml, setCalendarsHtml] = useState([]);

  useEffect(() => {
    // Recupera os calendários do localStorage
    const data = localStorage.getItem('calendarsToPrint');
    if (!data) {
      alert('Nenhum calendário encontrado para imprimir!');
      navigate(-1); // Volta para a página anterior caso não haja calendários
      return;
    }
    const storedCalendars = JSON.parse(data) || [];
    setCalendarsHtml(storedCalendars);

    // Aguarda renderização e abre o print automaticamente
    setTimeout(() => {
      window.print();
      localStorage.removeItem('calendarsToPrint');
      window.close();
    }, 500);
  }, [navigate]);

  return (
    <div>
      {calendarsHtml.map((html, index) => (
        <div
          key={index}
          dangerouslySetInnerHTML={{ __html: html }}
          className='page-break'
        />
      ))}
    </div>
  );
};

export default ClassroomCalendarPrintPage;
