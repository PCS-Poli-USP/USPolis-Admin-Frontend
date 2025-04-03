import { AddIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Select as CSelect,
  UnorderedList,
  useDisclosure,
  Spinner,
  Text,
  VStack,
  HStack,
  Box,
} from '@chakra-ui/react';
import Select from 'react-select';
import useBuildings from 'hooks/useBuildings';
import useCalendars from 'hooks/useCalendars';
import { useEffect, useRef, useState } from 'react';
import { CrawlerType } from 'utils/enums/subjects.enum';

interface CrawlerPopoverProps {
  subjects?: string[];
  crawlerType: CrawlerType | undefined;
  setCrawlerType: (type: CrawlerType | undefined) => void;
  onSave: (
    subjectsList: string[],
    building_id: number,
    calendar_ids: number[],
    type: CrawlerType,
  ) => void;
}

export default function CrawlerPopover({
  subjects = [],
  onSave,
  crawlerType,
  setCrawlerType,
}: CrawlerPopoverProps) {
  const { buildings, loading: buildingsLoading } = useBuildings();
  const { calendars, loading: calendarsLoading } = useCalendars();

  const [subjectsList, setSubjectsList] = useState(subjects);
  const [subjectInput, setSubjectInput] = useState('');
  const [multSubjectInput, setMultSubjectInput] = useState('');
  const [buildingIdSelection, setBuildingIdSelection] = useState<
    number | undefined
  >(undefined);
  const [calendarIds, setCalendarIds] = useState<number[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialFocusRef = useRef(null);

  useEffect(() => {
    if (buildings.length === 1) {
      setBuildingIdSelection(buildings[0].id);
    }
  }, [buildings]);

  function handleAddClick() {
    if (subjectInput.length === 7 && !subjectsList.includes(subjectInput)) {
      setSubjectsList((prev) => [...prev, subjectInput.replaceAll(' ', '')]);
    }
    setSubjectInput('');
    if (multSubjectInput.length >= 7) {
      const formatedInput = multSubjectInput.replaceAll(' ', '');
      const subjects = formatedInput
        .split(',')
        .filter((value) => value.length === 7 && !subjectsList.includes(value));
      setSubjectsList((prev) => prev.concat(subjects));
    }
    setMultSubjectInput('');
  }

  function handleCleanClick() {
    setSubjectsList([]);
  }

  function handleConfirmClick() {
    if (
      buildingIdSelection !== undefined &&
      subjectsList.length > 0 &&
      crawlerType
    ) {
      setSubjectsList([]);
      onSave(subjectsList, buildingIdSelection, calendarIds, crawlerType);
      onClose();
    }
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
    >
      <PopoverTrigger>
        <Button colorScheme='blue'>Adicionar automaticamente</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverCloseButton />
        <PopoverHeader>Disciplinas</PopoverHeader>
        <PopoverBody>
          <VStack gap={'10px'} alignItems={'flex-start'}>
            <Box w={'100%'} hidden={buildings.length === 1}>
              <Text mb={2}>Prédio:</Text>
              <CSelect
                placeholder='Selecionar prédio'
                onChange={(event) =>
                  setBuildingIdSelection(Number(event.target.value))
                }
                icon={buildingsLoading ? <Spinner size='sm' /> : undefined}
              >
                {buildings.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.name}
                  </option>
                ))}
              </CSelect>
            </Box>

            <Box w={'100%'} mb={'5px'}>
              <Text>Fonte:</Text>
              <CSelect
                placeholder='Selecionar Jupiter ou Janus'
                value={crawlerType}
                onChange={(event) => {
                  const value = event.target.value as CrawlerType;
                  if (value) setCrawlerType(value);
                  else setCrawlerType(undefined);
                }}
              >
                <option value={'jupiter'}>Júpiter</option>
                <option value={'janus'}>Janus</option>
              </CSelect>
            </Box>

            <Box w={'100%'}>
              <Text>Calendários das turmas:</Text>
              <Select
                placeholder='Selecione os calendários'
                isMulti
                options={calendars.map((calendar) => ({
                  label: calendar.name,
                  value: calendar.id,
                }))}
                onChange={(
                  selectedOptions: { value: number; label: string }[],
                ) =>
                  setCalendarIds(selectedOptions.map((option) => option.value))
                }
                isLoading={calendarsLoading}
              />
            </Box>

            <Box w={'100%'}>
              <Text>Adicionar:</Text>
              <InputGroup>
                <Input
                  value={multSubjectInput}
                  onChange={(event) =>
                    setMultSubjectInput(event.target.value.toUpperCase())
                  }
                  placeholder='Códigos das disciplinas'
                  onKeyDownCapture={(e) => {
                    if (e.key === 'Enter') handleAddClick();
                  }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label='adicionar-disciplina'
                    size='sm'
                    colorScheme='blue'
                    icon={<AddIcon />}
                    onClick={handleAddClick}
                  />
                </InputRightElement>
              </InputGroup>
              <Text as={'b'} fontSize={'sm'} noOfLines={1} mt={2}>
                *Separe os códigos usando vírgula
              </Text>
              <Text as={'b'} fontSize={'sm'} noOfLines={1}>
                *Não se preocupe com espaços
              </Text>
            </Box>

            <Box w={'100%'}>
              <Text>Lista de disciplinas: ({subjectsList.length})</Text>
              <UnorderedList p={2}>
                {subjectsList.map((it) => (
                  <ListItem key={it}>{it}</ListItem>
                ))}
              </UnorderedList>
            </Box>
          </VStack>
        </PopoverBody>
        {subjectsList.length > 0 &&
          buildingIdSelection !== undefined &&
          buildingIdSelection !== 0 && (
            <PopoverFooter>
              <VStack>
                {subjectsList.length > 10 ? (
                  <Alert status={'warning'} fontSize={'sm'}>
                    <AlertIcon />
                    Isso pode levar algum tempo
                  </Alert>
                ) : undefined}
                <HStack alignSelf={'flex-end'}>
                  <Button
                    colorScheme='yellow'
                    size='sm'
                    variant='outline'
                    onClick={handleCleanClick}
                  >
                    Limpar
                  </Button>
                  <Spacer />
                  <Button
                    colorScheme='blue'
                    size='sm'
                    onClick={handleConfirmClick}
                    disabled={crawlerType === undefined}
                  >
                    Confirmar
                  </Button>
                </HStack>
              </VStack>
            </PopoverFooter>
          )}
      </PopoverContent>
    </Popover>
  );
}
