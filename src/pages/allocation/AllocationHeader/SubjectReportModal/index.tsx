import { DownloadIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Text,
  Alert,
  AlertIcon,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
} from '@chakra-ui/react';
import TooltipSelect, {
  Option,
} from '../../../../components/common/TooltipSelect';
import { SubjectResponse } from '../../../../models/http/responses/subject.response.models';
import { useState } from 'react';
import { BuildingResponse } from '../../../../models/http/responses/building.response.models';
import useClasses from '../../../../hooks/classes/useClasses';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ClassesPDF from '../../pdf/ClassesPDF/classesPDF';
import { ModalProps } from '../../../../models/interfaces';
import { getEndOfSemester, getStartOfSemester } from '../utils';

interface SubjectReportModalProps extends ModalProps {
  loading: boolean;
  buildings: BuildingResponse[];
  subjects: SubjectResponse[];
}

function SubjectReportModal({
  isOpen,
  onClose,
  loading,
  subjects,
  buildings,
}: SubjectReportModalProps) {
  const {
    loading: loadingClasses,
    classes,
    getClassesBySubjects,
  } = useClasses(false);

  const [selectedSubjects, setSelectedSubjects] = useState<Option[]>([]);
  const [start, setStart] = useState<string>(getStartOfSemester());
  const [end, setEnd] = useState<string>(getEndOfSemester());
  const [showClassError, setShowClassError] = useState<boolean>(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent maxW={'800px'} w={'800px'} h={'800px'} bg={'uspolis.white'}>
        <ModalHeader fontWeight={'bold'} fontSize={'lg'} maxH={'50px'}>
          Alocações de Disciplinas
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY={'auto'} h={'full'}>
          <Flex
            direction={'column'}
            gap={'10px'}
            justify={'space-between'}
            h={'full'}
          >
            <Flex direction={'column'} gap={'10px'}>
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
              </Flex>

              <Text fontWeight={'bold'}>Escolher com base em um prédio:</Text>
              <TooltipSelect
                placeholder='Adicione todas disciplinas do prédio'
                isLoading={loading}
                value={null}
                options={buildings.map((building) => ({
                  value: building.id,
                  label: building.name,
                }))}
                maxMenuHeight={200}
                onChange={(option) => {
                  if (option) {
                    const newSelectedSubjects = [...selectedSubjects];
                    subjects
                      .filter(
                        (subject) =>
                          !!subject.building_ids.find(
                            (id) => id === option.value,
                          ),
                      )
                      .forEach((subject) => {
                        if (
                          !newSelectedSubjects.find(
                            (s) => s.value === subject.id,
                          )
                        ) {
                          newSelectedSubjects.push({
                            value: subject.id,
                            label: `${subject.code} - ${subject.name}`,
                          });
                        }
                      });
                    setSelectedSubjects(newSelectedSubjects);
                    setShowClassError(false);
                  }
                }}
              />
              <Text fontWeight={'bold'}>Seleção manual:</Text>
              <TooltipSelect
                placeholder='Selecione as disciplinas'
                isMulti
                isLoading={loading}
                value={selectedSubjects.sort((a, b) =>
                  a.label.localeCompare(b.label),
                )}
                closeMenuOnSelect={false}
                onChange={(selected) => {
                  if (selected) {
                    setSelectedSubjects(selected as Option[]);
                  }
                  setShowClassError(false);
                }}
                options={subjects.map((subject) => ({
                  value: subject.id,
                  label: `${subject.code} - ${subject.name}`,
                }))}
              />
            </Flex>
            <Flex
              direction={'column'}
              gap={'10px'}
              mt={'10px'}
              align={'flex-end'}
            >
              {selectedSubjects.length == 0 && (
                <Alert
                  status='error'
                  h={'full'}
                  w={'fit-content'}
                  borderRadius={'10px'}
                >
                  <AlertIcon />
                  {'Selecione pelo menos uma disciplina para continuar!'}
                </Alert>
              )}
              {showClassError &&
                !loadingClasses &&
                selectedSubjects.length > 0 &&
                classes.length == 0 && (
                  <Alert
                    status='error'
                    h={'full'}
                    w={'fit-content'}
                    borderRadius={'10px'}
                  >
                    <AlertIcon />
                    {
                      'Nenhuma turma encontrada para as disciplinas selecionadas!'
                    }
                  </Alert>
                )}
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter maxH={'80px'}>
          <Flex justify={'flex-end'} align={'center'} gap={'10px'}>
            <Button
              onClick={() => {
                getClassesBySubjects(
                  selectedSubjects.map((s) => s.value as number),
                  start,
                  end,
                );
                setShowClassError(true);
              }}
              isLoading={loadingClasses}
              disabled={selectedSubjects.length === 0}
            >
              Confirmar
            </Button>
            <PDFDownloadLink
              document={<ClassesPDF classes={classes} />}
              fileName={'alocacao-disciplinas.pdf'}
            >
              <Button
                w={'full'}
                isLoading={loadingClasses}
                disabled={
                  classes.length == 0 || loadingClasses || !start || !end
                }
                fontWeight={'bold'}
                variant={'outline'}
                colorScheme={'blue'}
                color={'uspolis.blue'}
                leftIcon={<DownloadIcon />}
              >
                Baixar
              </Button>
            </PDFDownloadLink>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SubjectReportModal;
