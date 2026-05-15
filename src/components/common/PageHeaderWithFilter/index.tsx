import { Flex, Text, useMediaQuery } from '@chakra-ui/react';
import DateRangeInput from './DataRangeInput';
import YearInput from './YearInput';

interface PageHeaderWithFilterProps {
  title: string;
  tooltip?: string;
  label?: string;
  start: string;
  end: string;
  setStart: (start: string) => void;
  setEnd: (end: string) => void;
  year?: string;
  setYear?: (year: string) => void;
  onConfirm: (start: string, end: string) => void;
  type?: 'year' | 'dateRange';
  onConfirmYear?: (year: string) => void;
  size?: 'default' | 'compact';
  align?: string;
  mt?: string;
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
  label = 'Período: Atual',
  type = 'dateRange',
  onConfirmYear = undefined,
  size = 'default',
  align = 'center',
  mt = undefined,
}: PageHeaderWithFilterProps) {
  const [isMobile] = useMediaQuery('(max-width: 800px)');

  return (
    <Flex
      direction={'row'}
      gap={'20px'}
      align={align}
      h={size === 'default' ? '60px' : '50px'}
      alignSelf={'center'}
      justifySelf={'center'}
      mb={size === 'default' ? '10px' : '0px'}
      mt={mt}
    >
      {title && <Text fontSize='4xl'>{title}</Text>}
      <Flex gap={'5px'} align={'center'}>
        {type === 'dateRange' && (
          <DateRangeInput
            title={tooltip}
            start={start}
            end={end}
            label={label}
            setStart={setStart}
            setEnd={setEnd}
            onConfirm={(start, end) => {
              onConfirm(start, end);
            }}
            isMobile={isMobile}
            compact={size === 'compact'}
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
            isMobile={isMobile}
          />
        )}
      </Flex>
    </Flex>
  );
}

export default PageHeaderWithFilter;
