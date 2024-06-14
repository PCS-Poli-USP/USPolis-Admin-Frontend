import { useCallback, useState } from 'react';
import { sortDates } from 'utils/holidays/holidays.sorter';

export const useDateCalendarPicker = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [occupiedDays, setOccupiedDays] = useState<string[]>([]);

  const dayClick = useCallback((day: string) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        const newDays = prev.filter((val) => val !== day);
        return newDays.sort(sortDates);
      }
      return [...prev, day].sort(sortDates)
    });
  }, []);

  const selectDay = useCallback((day: string) => {
    setSelectedDays((prev) => {
      if (!prev.includes(day)) {
        return [...prev, day].sort(sortDates);
      }
      return prev;
    });
  }, []);

  const selectManyDays = useCallback((days: string[]) => {
    setSelectedDays((prev) => {
      const newDays = days.filter((day) => !prev.includes(day));
      return [...prev, ...newDays].sort(sortDates);
    });
  }, []);

  const occupyDay = useCallback((day: string) => {
    setOccupiedDays((prev) => {
      if (!prev.includes(day)) {
        return [...prev, day].sort(sortDates);
      }
      return prev;
    });
  }, []);

  const occupyManyDays = useCallback((days: string[]) => {
    setOccupiedDays((prev) => {
      const newDays = days.filter((day) => !prev.includes(day));
      return [...prev, ...newDays].sort(sortDates);
    });
  }, []);

  return {
    dayClick,
    selectedDays,
    selectDay,
    selectManyDays,
    occupiedDays,
    occupyDay,
    occupyManyDays,
  };
};
