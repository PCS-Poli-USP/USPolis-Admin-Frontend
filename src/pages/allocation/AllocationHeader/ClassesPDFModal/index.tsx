import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Text,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  IconButton,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import TooltipSelect, {
  Option,
} from '../../../../components/common/TooltipSelect';
import { useEffect, useState } from 'react';
import { BuildingResponse } from '../../../../models/http/responses/building.response.models';
import useClasses from '../../../../hooks/classes/useClasses';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ClassesPDF from '../../pdf/ClassesPDF/classesPDF';
import { ModalProps } from '../../../../models/interfaces';
import { getEndOfSemester, getStartOfSemester } from '../utils';
import { normalizeString } from '../../../../utils/formatters';
import { ClassesBySubject } from '../../../../utils/classes/classes.mapper';
import { AllocationEnum } from '../../../../utils/enums/allocation.enum';
import { getScheduleTime } from '../../../../utils/schedules/schedule.formatter';
import { classNumberFromClassCode } from '../../../../utils/classes/classes.formatter';

interface ClassesPDFModalProps extends ModalProps {
  buildings: BuildingResponse[];
}

const PREVIEW_COLUMNS = '0.7fr 1fr 1fr 1.4fr 1.6fr';

function ClassesPDFModal({ isOpen, onClose, buildings }: ClassesPDFModalProps) {
  const {
    loading: loadingClasses,
    classes,
    getClassesByBuildingName,
  } = useClasses(false);

  const [selectedBuilding, setSelectedBuilding] = useState<Option | null>(null);
  const [start, setStart] = useState<string>(getStartOfSemester());
  const [end, setEnd] = useState<string>(getEndOfSemester());
  const [pageIndex, setPageIndex] = useState(0);

  const pages = ClassesBySubject(classes);
  const currentPage = pages[pageIndex];

  useEffect(() => {
    if (selectedBuilding && start && end) {
      getClassesByBuildingName(selectedBuilding.label, start, end);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBuilding, start, end]);

  useEffect(() => {
    setPageIndex(0);
  }, [classes]);

  function handleClose() {
    setSelectedBuilding(null);
    setStart(getStartOfSemester());
    setEnd(getEndOfSemester());
    setPageIndex(0);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size={'6xl'}>
      <ModalOverlay />

      <ModalContent h={'640px'} maxW={'980px'} bg={'uspolis.white'}>
        <ModalHeader fontWeight={'bold'} fontSize={'lg'} maxH={'60px'}>
          Alocações de Disciplinas
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0} h={'full'} overflow={'hidden'}>
          <Flex h={'full'} minH={0}>
            <Flex
              direction={'column'}
              gap={'16px'}
              w={'320px'}
              flexShrink={0}
              borderRight={'1px solid'}
              borderColor={'uspolis.lightGray'}
              p={'18px'}
              overflowY={'auto'}
            >
              <Flex direction={'row'} gap={'10px'}>
                <Flex direction={'column'} flex={1} gap={'4px'}>
                  <Text fontWeight={'bold'} fontSize={'sm'}>
                    Início:
                  </Text>
                  <Input
                    size={'sm'}
                    type='date'
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                  {!start && (
                    <Text color={'red.500'} fontSize={'xs'}>
                      Selecione a data de início!
                    </Text>
                  )}
                </Flex>
                <Flex direction={'column'} flex={1} gap={'4px'}>
                  <Text fontWeight={'bold'} fontSize={'sm'}>
                    Fim:
                  </Text>
                  <Input
                    size={'sm'}
                    type='date'
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                  {!end && (
                    <Text color={'red.500'} fontSize={'xs'}>
                      Selecione a data de fim!
                    </Text>
                  )}
                </Flex>
              </Flex>

              <Flex direction={'column'} gap={'4px'}>
                <Text fontWeight={'bold'} fontSize={'sm'}>
                  Prédio:
                </Text>
                <TooltipSelect
                  placeholder={'Selecione um prédio'}
                  options={buildings.map((building) => ({
                    value: building.name,
                    label: building.name,
                  }))}
                  isClearable={true}
                  onChange={(option) => setSelectedBuilding(option)}
                />
              </Flex>

              <Flex direction={'column'} gap={'8px'} mt={'auto'}>
                <Text fontSize={'xs'} color={'uspolis.gray'}>
                  {`${pages.length} disciplina${pages.length === 1 ? '' : 's'} · ${pages.length} página${pages.length === 1 ? '' : 's'}`}
                </Text>
                <PDFDownloadLink
                  document={<ClassesPDF classes={classes} />}
                  fileName={
                    selectedBuilding
                      ? `disciplinas-${normalizeString(selectedBuilding.label)}.pdf`
                      : 'disciplinas.pdf'
                  }
                >
                  <Button
                    w={'full'}
                    size={'sm'}
                    isLoading={loadingClasses}
                    disabled={
                      !selectedBuilding || loadingClasses || !start || !end
                    }
                    fontWeight={'bold'}
                    variant={'outline'}
                    colorScheme={'blue'}
                    color={'uspolis.blue'}
                    leftIcon={<DownloadIcon />}
                  >
                    Baixar disciplinas.pdf
                  </Button>
                </PDFDownloadLink>
              </Flex>
            </Flex>

            <Flex
              direction={'column'}
              align={'center'}
              flex={1}
              gap={'14px'}
              p={'22px'}
              bg={'#F4F4F5'}
              overflowY={'auto'}
            >
              <Text
                alignSelf={'flex-start'}
                fontSize={'xs'}
                fontWeight={'bold'}
                color={'uspolis.gray'}
                textTransform={'uppercase'}
                letterSpacing={'0.04em'}
              >
                Pré-visualização
              </Text>

              {currentPage ? (
                <Box
                  bg={'uspolis.white'}
                  w={'360px'}
                  sx={{ aspectRatio: '595 / 842' }}
                  display={'flex'}
                  flexDirection={'column'}
                  boxShadow={'0 1px 6px rgba(0,0,0,0.15)'}
                  borderRadius={'2px'}
                  p={'20px'}
                >
                  <Text
                    textAlign={'center'}
                    color={'red.500'}
                    fontWeight={'bold'}
                    fontSize={'md'}
                  >
                    {currentPage[0]}
                  </Text>
                  <Text
                    textAlign={'center'}
                    fontWeight={'bold'}
                    fontSize={'2xs'}
                    mb={'6px'}
                  >
                    {currentPage[1].at(0)?.subject_name}
                  </Text>
                  <Grid
                    templateColumns={PREVIEW_COLUMNS}
                    border={'0.5px solid'}
                    borderColor={'uspolis.black'}
                  >
                    <PreviewHeaderCell>Turma</PreviewHeaderCell>
                    <PreviewHeaderCell>Prédio</PreviewHeaderCell>
                    <PreviewHeaderCell>Sala</PreviewHeaderCell>
                    <PreviewHeaderCell>Horários</PreviewHeaderCell>
                    <PreviewHeaderCell last>Professores</PreviewHeaderCell>
                    {currentPage[1].map((cl) => (
                      <>
                        <PreviewCell key={`${cl.code}-class`}>
                          {classNumberFromClassCode(cl.code)}
                        </PreviewCell>
                        <PreviewCell key={`${cl.code}-building`}>
                          {cl.schedules.map((schedule, index) => (
                            <Text key={index} fontSize={'7px'}>
                              {schedule.building || AllocationEnum.UNALLOCATED}
                            </Text>
                          ))}
                        </PreviewCell>
                        <PreviewCell key={`${cl.code}-classroom`}>
                          {cl.schedules.map((schedule, index) => (
                            <Text key={index} fontSize={'7px'}>
                              {schedule.classroom || AllocationEnum.UNALLOCATED}
                            </Text>
                          ))}
                        </PreviewCell>
                        <PreviewCell key={`${cl.code}-time`}>
                          {cl.schedules.map((schedule, index) => (
                            <Text key={index} fontSize={'7px'}>
                              {getScheduleTime(schedule)}
                            </Text>
                          ))}
                        </PreviewCell>
                        <PreviewCell key={`${cl.code}-professors`} last>
                          {cl.professors.map((professor, index) => (
                            <Text key={index} fontSize={'7px'}>
                              {professor}
                            </Text>
                          ))}
                        </PreviewCell>
                      </>
                    ))}
                  </Grid>
                  <Text
                    mt={'auto'}
                    pt={'10px'}
                    textAlign={'center'}
                    fontSize={'7px'}
                    color={'uspolis.lightGray'}
                  >
                    Feito por{' '}
                    <Text
                      as={'span'}
                      color={'uspolis.blue'}
                      fontWeight={'bold'}
                    >
                      USPolis
                    </Text>{' '}
                    · uspolis.com.br
                  </Text>
                </Box>
              ) : (
                <Text color={'uspolis.gray'} mt={'40px'}>
                  {selectedBuilding
                    ? 'Nenhuma disciplina encontrada para o período selecionado.'
                    : 'Selecione um prédio e um período para ver a prévia.'}
                </Text>
              )}

              {pages.length > 1 && (
                <Flex align={'center'} gap={'10px'}>
                  <IconButton
                    aria-label='página anterior'
                    icon={<ChevronLeftIcon />}
                    size={'xs'}
                    isDisabled={pageIndex === 0}
                    onClick={() => setPageIndex((prev) => prev - 1)}
                  />
                  <Flex gap={'6px'}>
                    {pages.map(([subjectCode], idx) => (
                      <Box
                        key={subjectCode}
                        as={'button'}
                        onClick={() => setPageIndex(idx)}
                        w={'8px'}
                        h={'8px'}
                        borderRadius={'50%'}
                        bg={
                          idx === pageIndex
                            ? 'uspolis.blue'
                            : 'uspolis.lightBlue'
                        }
                      />
                    ))}
                  </Flex>
                  <IconButton
                    aria-label='próxima página'
                    icon={<ChevronRightIcon />}
                    size={'xs'}
                    isDisabled={pageIndex === pages.length - 1}
                    onClick={() => setPageIndex((prev) => prev + 1)}
                  />
                </Flex>
              )}
              {pages.length > 0 && (
                <Text fontSize={'xs'} color={'uspolis.lightGray'}>
                  {`Página ${pageIndex + 1} de ${pages.length}`}
                </Text>
              )}
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function PreviewHeaderCell({
  children,
  last = false,
}: {
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <GridItem
      p={'5px 4px'}
      fontSize={'7px'}
      fontWeight={'bold'}
      textAlign={'center'}
      borderRight={last ? undefined : '0.5px solid'}
      borderBottom={'0.5px solid'}
      borderColor={'uspolis.black'}
    >
      {children}
    </GridItem>
  );
}

function PreviewCell({
  children,
  last = false,
}: {
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <GridItem
      p={'5px 4px'}
      textAlign={'center'}
      borderRight={last ? undefined : '0.5px solid'}
      borderTop={'0.5px solid'}
      borderColor={'uspolis.black'}
    >
      {children}
    </GridItem>
  );
}

export default ClassesPDFModal;
