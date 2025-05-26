import { Flex, IconButton, Text } from '@chakra-ui/react';
import DateRangeInput from './DataRangeInput';
import { useState } from 'react';
import { CloseIcon } from '@chakra-ui/icons';

interface PageTitleProps {
  title: string;
  onConfirm: (start: string, end: string) => void;
}

function PageTitle({ title, onConfirm }: PageTitleProps) {
  const [rangeApplied, setRangeApplied] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  function formatDate(date: string) {
    if (!date) return '';
    const values = date.split('-');
    if (values.length !== 3) return '';
    return `${values[2]}/${values[1]}/${values[0]}`;
  }

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
        <DateRangeInput
          title={title}
          start={start}
          end={end}
          setStart={setStart}
          setEnd={setEnd}
          onConfirm={(start, end) => {
            onConfirm(start, end);
            setRangeApplied(true);
          }}
          onReset={() => {
            setRangeApplied(false);
            onConfirm('', '');
          }}
        />
        {!rangeApplied && (
          <Flex
            borderRadius={'40px'}
            border={'1px solid #408080'}
            p={'5px'}
            gap={'5px'}
            justify={'center'}
            align={'center'}
          >
            <Text fontWeight={'bold'}>Período: Até o momento</Text>
          </Flex>
        )}
        {rangeApplied && (
          <Flex
            borderRadius={'40px'}
            border={'1px solid #408080'}
            p={'5px'}
            gap={'5px'}
            justify={'center'}
            align={'center'}
          >
            <Text fontWeight={'bold'}>
              Período: {formatDate(start)} até {formatDate(end)}
            </Text>
            <IconButton
              aria-label='Remover período'
              icon={<CloseIcon />}
              isRound
              size={'sm'}
              variant={'ghost'}
              onClick={() => {
                setRangeApplied(false);
                setStart('');
                setEnd('');
                onConfirm('', '');
              }}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

export default PageTitle;
