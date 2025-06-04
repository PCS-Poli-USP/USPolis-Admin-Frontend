import { CloseIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Tooltip,
  useDisclosure,
  Input,
  Flex,
  PopoverFooter,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Icon,
  PopoverArrow,
} from '@chakra-ui/react';
import { useState } from 'react';
import { LuCalendarSearch } from 'react-icons/lu';

interface DateRangeInputProps {
  title: string;
  start: string;
  end: string;
  setStart: (start: string) => void;
  setEnd: (end: string) => void;
  onConfirm: (start: string, end: string) => void;
}

function DateRangeInput({
  title,
  start,
  end,
  setStart,
  setEnd,
  onConfirm,
}: DateRangeInputProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const [rangeApplied, setRangeApplied] = useState(false);

  const [hasStartError, setHasStartError] = useState(false);
  const [startErroMsg, setStartErrorMsg] = useState('');

  const [hasEndError, setHasEndError] = useState(false);
  const [endErrorMsg, setEndErrorMsg] = useState('');

  function validate() {
    let isValid = true;
    if (!start) {
      setHasStartError(true);
      setStartErrorMsg('Data inválida');
      isValid = false;
    } else {
      setHasStartError(false);
      setStartErrorMsg('');
    }

    if (!end) {
      setHasEndError(true);
      setEndErrorMsg('Data inválida');
      isValid = false;
    } else {
      setHasEndError(false);
      setEndErrorMsg('');
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate > endDate) {
      setHasStartError(true);
      setStartErrorMsg('Data de inicio deve ser menor que a de fim');
      isValid = false;
    }
    return isValid;
  }

  function resetValues() {
    setStart('');
    setEnd('');
    setRangeApplied(false);
  }

  function resetErrors() {
    setHasStartError(false);
    setStartErrorMsg('');
    setHasEndError(false);
    setEndErrorMsg('');
  }

  function handleConfirm() {
    if (!validate()) return;
    resetErrors();
    onConfirm(start, end);
    setRangeApplied(true);
    onClose();
  }

  function formatDate(date: string) {
    if (!date) return '';
    const values = date.split('-');
    if (values.length !== 3) return '';
    return `${values[2]}/${values[1]}/${values[0]}`;
  }

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement='right'>
      <PopoverTrigger>
        <Tooltip label={`Ver ${title} anteriores`} placement='top'>
          <Flex
            gap={'10px'}
            align={'center'}
            cursor={'pointer'}
            _hover={{ opacity: 0.6 }}
          >
            <Icon as={LuCalendarSearch} boxSize={'30px'} onClick={onToggle} />
            {!rangeApplied && (
              <Flex
                borderRadius={'40px'}
                border={'1px solid #408080'}
                p={'5px'}
                gap={'5px'}
                justify={'center'}
                align={'center'}
                onClick={onToggle}
              >
                <Text fontWeight={'bold'}>Período: Atual</Text>
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
                <Text fontWeight={'bold'} onClick={onToggle}>
                  Período: {formatDate(start)} até {formatDate(end)}
                </Text>
                <IconButton
                  aria-label='Remover período'
                  icon={<CloseIcon />}
                  _hover={{ bg: 'red.500', color: 'white', opacity: 1.0 }}
                  isRound
                  size={'sm'}
                  variant={'ghost'}
                  onClick={() => {
                    resetValues();
                    if (rangeApplied) onConfirm('', '');
                  }}
                />
              </Flex>
            )}
          </Flex>
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent w={'400px'}>
        <PopoverCloseButton />
        <PopoverHeader fontWeight={'bold'}>Selecione o período</PopoverHeader>
        <PopoverArrow />
        <PopoverBody>
          <Flex direction={'row'} gap={'10px'}>
            <Flex direction={'column'} gap={'10px'} w={'50%'}>
              <FormControl isInvalid={hasStartError}>
                <FormLabel>Início:</FormLabel>
                <Input
                  type='date'
                  value={start}
                  max={end}
                  onChange={(e) => setStart(e.target.value)}
                />
                {hasStartError && (
                  <FormErrorMessage>{startErroMsg}</FormErrorMessage>
                )}
              </FormControl>
            </Flex>
            <Flex direction={'column'} gap={'10px'} w={'50%'}>
              <FormControl isInvalid={hasEndError}>
                <FormLabel>Fim:</FormLabel>
                <Input
                  type='date'
                  min={start}
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
                {hasEndError && (
                  <FormErrorMessage>{endErrorMsg}</FormErrorMessage>
                )}
              </FormControl>
            </Flex>
          </Flex>
        </PopoverBody>
        <PopoverFooter>
          <Flex direction={'row'} gap={'10px'}>
            <Button
              colorScheme='blue'
              w={'50%'}
              onClick={() => {
                handleConfirm();
              }}
            >
              Confirmar
            </Button>
            <Button
              w={'50%'}
              colorScheme='red'
              onClick={() => {
                resetValues();
                resetErrors();
                if (rangeApplied) onConfirm('', '');
                onClose();
              }}
            >
              Desfazer
            </Button>
          </Flex>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}
export default DateRangeInput;
