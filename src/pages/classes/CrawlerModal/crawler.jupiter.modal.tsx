import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Text,
  VStack,
  HStack,
  Box,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  ModalFooter,
  Flex,
  StackDivider,
  SimpleGrid,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { MultiValue } from 'react-select';
import useBuildings from '../../../hooks/useBuildings';
import { useEffect, useState } from 'react';
import { CrawlerType } from '../../../utils/enums/subjects.enum';
import { CalendarResponse } from '../../../models/http/responses/calendar.responde.models';
import { ModalProps } from '../../../models/interfaces';
import { MdCheckCircle } from 'react-icons/md';
import { SubjectResponse } from '../../../models/http/responses/subject.response.models';
import TooltipSelect, {
  Option,
} from '../../../components/common/TooltipSelect';

interface CrawlerJupiterModalProps extends ModalProps {
  subjects: SubjectResponse[];
  crawlerType: CrawlerType | undefined;
  setCrawlerType: (type: CrawlerType | undefined) => void;
  calendars: CalendarResponse[];
  loadingCalendars: boolean;
  onSave: (
    subjectsList: string[],
    building_id: number,
    calendar_ids: number[],
    type: CrawlerType,
  ) => void;
}

export default function CrawlerJupiterModal({
  subjects,
  onSave,
  crawlerType,
  setCrawlerType,
  calendars,
  loadingCalendars,
  isOpen,
  onClose,
}: CrawlerJupiterModalProps) {
  const { buildings, loading: buildingsLoading } = useBuildings();

  const [subjectsList, setSubjectsList] = useState<string[]>([]);
  const [subjectInput, setSubjectInput] = useState('');
  const [multSubjectInput, setMultSubjectInput] = useState('');
  const [buildingIdSelection, setBuildingIdSelection] = useState<
    number | undefined
  >(undefined);
  const [calendarIds, setCalendarIds] = useState<number[]>([]);

  useEffect(() => {
    if (buildings.length === 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={'4xl'}
      closeOnOverlayClick={false}
      motionPreset='slideInBottom'
      scrollBehavior='outside'
    >
      <ModalOverlay />
      <ModalContent h={'full'} maxH={'85vh'} overflowY={'auto'}>
        <ModalHeader>Disciplinas e Turmas</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction={'column'} gap={'15px'} w={'100%'}>
            <Text>
              Escolha as disciplinas que terão suas turmas adicionadas através
              do Júpiter ou do Janus.
            </Text>
            <HStack
              gap={'10px'}
              mb={'20px'}
              divider={<StackDivider />}
              w={'100%'}
              align={'flex-start'}
            >
              <VStack gap={'10px'} alignItems={'flex-start'} w={'50%'}>
                <Box w={'100%'} hidden={buildings.length === 1}>
                  <Text>Prédio:</Text>
                  <TooltipSelect
                    placeholder='Selecionar prédio'
                    onChange={(option) => {
                      if (!option) {
                        setBuildingIdSelection(undefined);
                        return;
                      }
                      setBuildingIdSelection(option.value as number);
                    }}
                    isLoading={buildingsLoading}
                    options={buildings.map((building) => ({
                      label: building.name,
                      value: building.id,
                    }))}
                  />
                </Box>

                <Box w={'100%'}>
                  <Text>Fonte:</Text>
                  <TooltipSelect
                    isMulti={false}
                    placeholder='Selecionar Jupiter ou Janus'
                    value={
                      crawlerType
                        ? {
                            label: CrawlerType.translate(crawlerType),
                            value: crawlerType.valueOf(),
                          }
                        : undefined
                    }
                    onChange={(option) => {
                      if (!option) {
                        setCrawlerType(undefined);
                        return;
                      }
                      const value = option.value as CrawlerType;
                      if (value) setCrawlerType(value);
                      else setCrawlerType(undefined);
                    }}
                    options={CrawlerType.values().map((type) => ({
                      label: CrawlerType.translate(type),
                      value: type.valueOf(),
                    }))}
                  />
                </Box>

                <Box w={'100%'}>
                  <Text>Calendários das turmas:</Text>
                  <TooltipSelect
                    placeholder='Selecione os calendários'
                    isMulti
                    options={calendars.map((calendar) => ({
                      label: `${calendar.name} (${calendar.year})`,
                      value: calendar.id,
                    }))}
                    onChange={(selectedOptions: MultiValue<Option>) =>
                      setCalendarIds(
                        selectedOptions.map((option) => option.value as number),
                      )
                    }
                    isLoading={loadingCalendars}
                  />
                </Box>
              </VStack>

              <VStack w={'50%'} h={'100%'} alignItems={'flex-start'}>
                <Box w={'100%'}>
                  <Text>Selecionar disciplinas já cadastradas:</Text>
                  <TooltipSelect
                    isMulti={false}
                    isClearable
                    placeholder='Selecione as disciplinas'
                    options={subjects.map((val) => ({
                      value: val.code,
                      label: `${val.code} - ${val.name}`,
                    }))}
                    onChange={(option) => {
                      if (!option) return;
                      if (subjectsList.includes((option.value as string) || ''))
                        return;
                      setSubjectsList((prev) =>
                        prev.concat(option.value as string),
                      );
                    }}
                  />
                </Box>
                <Box w={'100%'}>
                  <Text>
                    Adicionar manualmente:{' '}
                    <Text
                      as={'span'}
                      fontWeight={'bold'}
                      fontSize={'xs'}
                      w={'full'}
                      ml={'15px'}
                    >
                      *use vírgulas para separar os códigos
                    </Text>
                  </Text>
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
                </Box>
                <Box w={'100%'} hidden={true}>
                  <Text>Selecionar com base em cursos:</Text>
                  <TooltipSelect
                    isMulti={false}
                    placeholder='Selecione os cursos'
                    options={subjects.map((val) => ({
                      value: val.code,
                      label: `${val.code} - ${val.name}`,
                    }))}
                    onChange={(option) => {
                      if (!option) return;
                      if (subjectsList.includes((option.value as string) || ''))
                        return;
                      setSubjectsList((prev) =>
                        prev.concat(option.value as string),
                      );
                    }}
                  />
                </Box>
              </VStack>
            </HStack>

            <Flex
              w={'100%'}
              direction={'column'}
              gap={'5px'}
              p={'10px'}
              border={'1px'}
              borderRadius={'10px'}
            >
              <Text borderBottom={'1px'}>
                Lista de disciplinas ({subjectsList.length}):
              </Text>
              <SimpleGrid
                p={'10px'}
                overflowY={'auto'}
                maxH={'200px'}
                w={'100%'}
                minChildWidth='120px'
                spacing='10px'
              >
                {subjectsList
                  .sort((a, b) => a.localeCompare(b))
                  .map((it, idx) => (
                    <Tooltip
                      label={subjects.find((val) => val.code == it)?.name}
                      placement='top'
                      key={it}
                    >
                      <Flex
                        direction={'row'}
                        alignItems={'center'}
                        maxW={'120px'}
                      >
                        <Icon as={MdCheckCircle} mr={'5px'} />
                        <Text w={'75px'}>{it}</Text>
                        <IconButton
                          icon={<CloseIcon />}
                          aria-label={`remove-${it}`}
                          size={'xs'}
                          variant={'ghost'}
                          ml={'10px'}
                          onClick={() => {
                            setSubjectsList(
                              subjectsList
                                .slice(0, idx)
                                .concat(subjectsList.slice(idx + 1)),
                            );
                          }}
                        />
                      </Flex>
                    </Tooltip>
                  ))}
              </SimpleGrid>
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <VStack w={'100%'} gap={'5px'} mb={'10px'}>
            {subjectsList.length > 10 ? (
              <Alert status={'warning'} fontSize={'sm'}>
                <AlertIcon />
                Isso pode levar algum tempo
              </Alert>
            ) : undefined}
            {subjectsList.length > 0 &&
              buildingIdSelection !== undefined &&
              buildingIdSelection !== 0 && (
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
              )}
            {(!buildingIdSelection || subjectsList.length === 0) && (
              <Alert status={'error'} fontSize={'sm'}>
                <AlertIcon />
                {!buildingIdSelection
                  ? 'Selecione um prédio para continuar'
                  : 'Adicione disciplinas para continuar'}
              </Alert>
            )}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
