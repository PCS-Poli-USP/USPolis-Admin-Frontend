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
  Flex,
  PopoverFooter,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Icon,
  PopoverArrow,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useState } from 'react';
import { LuCalendarSearch } from 'react-icons/lu';

interface DateRangeInputProps {
  title: string;
  year: string;
  setYear: (year: string) => void;
  onConfirm: (year: string) => void;
  isMobile: boolean;
}

function YearInput({
  title,
  year,
  setYear,
  onConfirm,
  isMobile,
}: DateRangeInputProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const [filterApplied, setFilterApplied] = useState(false);

  const [hasYearError, setHasYearError] = useState(false);
  const [yearErroMsg, setYearErrorMsg] = useState('');

  const currentYear = new Date().getFullYear().toString();

  function validate() {
    let isValid = true;
    if (!year) {
      setHasYearError(true);
      setYearErrorMsg('Ano inválido');
      isValid = false;
    } else {
      setHasYearError(false);
      setYearErrorMsg('');
    }
    return isValid;
  }

  function resetValues() {
    setYear(currentYear);
    setFilterApplied(false);
  }

  function resetErrors() {
    setHasYearError(false);
    setYearErrorMsg('');
  }

  function handleConfirm() {
    if (!validate()) return;
    resetErrors();
    onConfirm(year);
    setFilterApplied(true);
    onClose();
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
            <Flex
              borderRadius={'40px'}
              border={'1px solid #408080'}
              p={'5px'}
              h={'40px'}
              gap={'5px'}
              justify={'center'}
              align={'center'}
            >
              <Text fontWeight={'bold'} onClick={onToggle}>
                Ano: {year}
              </Text>
              {filterApplied && (
                <IconButton
                  aria-label='Remover filtro de ano'
                  icon={<CloseIcon />}
                  _hover={{ bg: 'red.500', color: 'white', opacity: 1.0 }}
                  isRound
                  size={'sm'}
                  variant={'ghost'}
                  onClick={() => {
                    resetValues();
                    onConfirm(currentYear);
                  }}
                />
              )}
            </Flex>
          </Flex>
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent w={isMobile ? '100vw' : '400px'}>
        <PopoverCloseButton />
        <PopoverHeader fontWeight={'bold'}>Selecione o ano</PopoverHeader>
        {!isMobile && <PopoverArrow />}
        <PopoverBody>
          <Flex direction={isMobile ? 'column' : 'row'} gap={'10px'}>
            <Flex direction={'column'} gap={'10px'} w={'100%'}>
              <FormControl isInvalid={hasYearError}>
                <FormLabel>Ano:</FormLabel>
                <NumberInput
                  value={year}
                  min={1900}
                  max={2100}
                  onChange={(valueString) => {
                    setYear(valueString);
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                {hasYearError && (
                  <FormErrorMessage>{yearErroMsg}</FormErrorMessage>
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
                if (filterApplied) onConfirm(currentYear);
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

export default YearInput;
