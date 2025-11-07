import { Flex, Text } from '@chakra-ui/react';
import DateRangeInput from './DataRangeInput';
import YearInput from './YearInput';

interface PageHeaderWithFilterProps {
  title: string;
  tooltip?: string;
  start: string;
  end: string;
  setStart: (start: string) => void;
  setEnd: (end: string) => void;
  year?: string;
  setYear?: (year: string) => void;
  onConfirm: (start: string, end: string) => void;
  type?: 'year' | 'dateRange';
  onConfirmYear?: (year: string) => void;
}

function PageHeaderWithFilter({
  title,
  start,
  end,
  year = new Date().getFullYear().toString(),
  setStart,
  setEnd,
  setYear = () => {},
  onConfirm,
  tooltip = `Ver ${title} anteriores`,
  type = 'dateRange',
  onConfirmYear = undefined,
}: PageHeaderWithFilterProps) {
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
            title={tooltip}
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
