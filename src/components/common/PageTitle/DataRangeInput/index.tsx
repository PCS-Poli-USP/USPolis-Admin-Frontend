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
  onReset: () => void;
}

function DateRangeInput({
  title,
  start,
  end,
  setStart,
  setEnd,
  onConfirm,
  onReset,
}: DateRangeInputProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();

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
    }

    if (!end) {
      setHasEndError(true);
      setEndErrorMsg('Data inválida');
      isValid = false;
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
    onClose();
  }

  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Tooltip label={`Ver ${title} anteriores`} placement='top'>
          <IconButton
            onClick={onToggle}
            variant={'ghost'}
            color={'uspolis.blue'}
            fontSize={'30px'}
            icon={<LuCalendarSearch />}
            aria-label='data-range-input'
          />
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent w={'400px'}>
        <PopoverCloseButton />
        <PopoverHeader fontWeight={'bold'}>Selecione o período</PopoverHeader>
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
                console.log('cancelar');
                handleConfirm();
              }}
            >
              Confirmar
            </Button>
            <Button
              w={'50%'}
              colorScheme='red'
              onClick={() => {
                console.log('cancelar');
                resetValues();
                resetErrors();
                onReset();
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
