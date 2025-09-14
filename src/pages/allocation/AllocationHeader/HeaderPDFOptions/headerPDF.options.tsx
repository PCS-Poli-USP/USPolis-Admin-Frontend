import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ClassesPDF from '../../pdf/ClassesPDF/classesPDF';
import { useEffect, useState } from 'react';
import useClasses from '../../../../hooks/classes/useClasses';
import { normalizeString } from '../../../../utils/formatters';
import useReservations from '../../../../hooks/reservations/useReservations';
import ClassroomsCalendarPDF from '../../../../pages/allocation/pdf/ClassroomsCalendarPDF/classrooms.calendar.pdf';
import { ModalProps } from '../../../../models/interfaces';
import ClassroomsEmptyCalendarReportPDF from '../../pdf/ClassroomsEmptyCalendarPDF/classrooms.empty.calendar.pdf';
import { DownloadIcon } from '@chakra-ui/icons';
import { SubjectResponse } from '../../../../models/http/responses/subject.response.models';
import SubjectReportPopover from './SubjectReportPopover';
import { BuildingResponse } from '../../../../models/http/responses/building.response.models';
import TooltipSelect, {
  Option,
} from '../../../../components/common/TooltipSelect';

interface PDFOptionsProps extends ModalProps {
  buildings: BuildingResponse[];
  loadingBuildings: boolean;
  subjects: SubjectResponse[];
  loadingSubjects: boolean;
  isMobile: boolean;
}

function HeaderPDFOptions({
  buildings,
  loadingBuildings,
  isOpen,
  onClose,
  subjects,
  loadingSubjects,
  isMobile,
}: PDFOptionsProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<Option | null>(null);
  const today = new Date();
  const [start, setStart] = useState<string>(getStartOfSemester());
  const [end, setEnd] = useState<string>(getEndOfSemester());

  const {
    loading: loadingC,
    classes,
    getClassesByBuildingName,
  } = useClasses(false);
  const {
    loading: loadingR,
    reservations,
    getReservationsByBuildingName,
  } = useReservations(false);

  function getStartOfSemester() {
    const semesterStart = new Date(today.getFullYear(), 0, 1);
    if (today.getMonth() >= 7) {
      semesterStart.setMonth(6, 21);
    }
    return semesterStart.toISOString().split('T')[0];
  }

  function getEndOfSemester() {
    const semesterEnd = new Date(today.getFullYear(), 11, 31);
    if (today.getMonth() < 7) {
      semesterEnd.setMonth(6, 20);
    }
    return semesterEnd.toISOString().split('T')[0];
  }

  useEffect(() => {
    if (selectedBuilding && start && end) {
      getClassesByBuildingName(selectedBuilding.label, start, end);
      getReservationsByBuildingName(selectedBuilding.label, start, end);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBuilding, start, end]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      size={'4xl'}
    >
      <ModalContent>
        <ModalHeader>Baixe alocações e relatórios</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack
            direction={'column'}
            align={'flex-start'}
            justify={'center'}
            p={'5px'}
            divider={<StackDivider />}
            mb={'10px'}
          >
            <Flex
              w={'full'}
              direction={'column'}
              alignItems={'center'}
              gap={'10px'}
            >
              <Flex
                w={'full'}
                direction={'row'}
                alignItems={'center'}
                gap={'10px'}
              >
                <Flex direction={'column'} w={'50%'}>
                  <Text fontWeight={'bold'}>Início: </Text>
                  <Input
                    type='date'
                    value={start}
                    onChange={(e) => {
                      setStart(e.target.value);
                    }}
                  />
                  {!start && (
                    <Text color={'red.500'} ml={'5px'} mt={'5px'}>
                      Selecione a data de início!
                    </Text>
                  )}
                </Flex>
                <Flex direction={'column'} w={'50%'}>
                  <Text fontWeight={'bold'}>Fim: </Text>
                  <Input
                    type='date'
                    value={end}
                    onChange={(e) => {
                      setEnd(e.target.value);
                    }}
                  />
                  {!end && (
                    <Text color={'red.500'} ml={'5px'} mt={'5px'}>
                      Selecione a data de fim!
                    </Text>
                  )}
                </Flex>
              </Flex>

              <Flex direction={'column'} w={'100%'}>
                <Text fontWeight={'bold'}>Prédio: </Text>
                <TooltipSelect
                  placeholder={'Selecione um prédio'}
                  options={buildings.map((building) => ({
                    value: building.name,
                    label: building.name,
                  }))}
                  isClearable={true}
                  onChange={(option) => {
                    setSelectedBuilding(option);
                  }}
                />
                {!selectedBuilding && (
                  <Text color={'red.500'} ml={'5px'} mt={'5px'}>
                    Selecione um prédio antes!
                  </Text>
                )}
              </Flex>
            </Flex>

            <Heading size={'md'} ml={'5px'}>
              Alocações gerais
            </Heading>

            <Box w={'full'}>
              <PDFDownloadLink
                document={<ClassesPDF classes={classes} />}
                fileName={
                  selectedBuilding
                    ? `disciplinas-${normalizeString(
                        selectedBuilding.label,
                      )}.pdf`
                    : 'disciplinas.pdf'
                }
              >
                <Button
                  w={'full'}
                  isLoading={loadingC || loadingR}
                  disabled={
                    !selectedBuilding || loadingC || loadingR || !start || !end
                  }
                  fontWeight={'bold'}
                  variant={'outline'}
                  colorScheme={'blue'}
                  color={'uspolis.text'}
                  leftIcon={<DownloadIcon />}
                >
                  Alocação das disciplinas
                </Button>
              </PDFDownloadLink>
            </Box>

            <Box w={'full'}>
              <ClassroomsCalendarPDF
                classes={classes}
                reservations={reservations}
                building={selectedBuilding ? selectedBuilding.label : ''}
                disabled={
                  !selectedBuilding || loadingC || loadingR || !start || !end
                }
                loading={loadingC || loadingR}
                startDate={start}
                endDate={end}
              />
            </Box>

            <Heading size={'md'} ml={'5px'}>
              Alocações específicas
            </Heading>

            <Box w={'full'}>
              <SubjectReportPopover
                disabled={loadingC || loadingR || !start || !end}
                loading={
                  loadingC || loadingR || loadingSubjects || loadingBuildings
                }
                subjects={subjects}
                buildings={buildings}
                start={start}
                end={end}
                isMobile={isMobile}
              />
            </Box>

            <Heading size={'md'} ml={'5px'}>
              Relatórios
            </Heading>
            <Box w={'full'}>
              <ClassroomsEmptyCalendarReportPDF
                classes={classes}
                reservations={reservations}
                building={selectedBuilding ? selectedBuilding.label : ''}
                disabled={
                  !selectedBuilding || loadingC || loadingR || !start || !end
                }
                loading={loadingC || loadingR}
                startDate={start}
                endDate={end}
              />
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default HeaderPDFOptions;
