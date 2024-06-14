import { useState } from 'react';

export const useDateCalendarPicker = () => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [highlightedDays, setHighlightedDays] = useState<string[]>([]);
  const [ocuppedDays, setOcuppedDays] = useState<string[]>([]);

  return {
    selectedDates,
    setSelectedDates,
    highlightedDays,
    setHighlightedDays,
    ocuppedDays,
    setOcuppedDays,
  };
};
