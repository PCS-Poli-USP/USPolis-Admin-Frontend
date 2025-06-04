import { Flex, Text } from '@chakra-ui/react';
import DateRangeInput from './DataRangeInput';
import { useState } from 'react';
import YearInput from './YearInput';

interface PageHeaderWithFilterProps {
  title: string;
  onConfirm: (start: string, end: string) => void;
  type?: 'year' | 'dateRange';
  onConfirmYear?: (year: string) => void;
}

function PageHeaderWithFilter({
  title,
  onConfirm,
  type = 'dateRange',
  onConfirmYear = undefined,
}: PageHeaderWithFilterProps) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());

  return (
    <Flex
      direction={'row'}
      gap={'20px'}
      align={'center'}
      h={'60px'}
      alignSelf={'center'}
      justifySelf={'center'}
      mb={'10px'}
    >
      <Text fontSize='4xl'>{title}</Text>
      <Flex gap={'5px'} align={'center'}>
        {type === 'dateRange' && (
          <DateRangeInput
            title={title}
            start={start}
            end={end}
            setStart={setStart}
            setEnd={setEnd}
            onConfirm={(start, end) => {
              onConfirm(start, end);
            }}
          />
        )}
        {type === 'year' && onConfirmYear && (
          <YearInput
            title={title}
            year={year}
            setYear={setYear}
            onConfirm={(year) => {
              onConfirmYear(year);
            }}
          />
        )}
      </Flex>
    </Flex>
  );
}

export default PageHeaderWithFilter;
