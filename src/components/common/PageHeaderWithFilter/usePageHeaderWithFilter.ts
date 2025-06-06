import { useState } from 'react';

const usePageHeaderWithFilter = () => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());

  return {
    start,
    setStart,
    end,
    setEnd,
    year,
    setYear,
  };
};

export default usePageHeaderWithFilter;
