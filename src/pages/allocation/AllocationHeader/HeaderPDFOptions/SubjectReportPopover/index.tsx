import { DownloadIcon } from '@chakra-ui/icons';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Portal,
  Flex,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import TooltipSelect from '../../../../../components/common/TooltipSelect';
import { SubjectResponse } from '../../../../../models/http/responses/subject.response.models';
import { useState } from 'react';
import { BuildingResponse } from '../../../../../models/http/responses/building.response.models';
import useClasses from '../../../../../hooks/classes/useClasses';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ClassesPDF from '../../../pdf/ClassesPDF/classesPDF';

type Option = {
  value: number;
  label: string;
};

interface SubjectReportPopoverProps {
  loading: boolean;
  disabled: boolean;
  buildings: BuildingResponse[];
  subjects: SubjectResponse[];
  start: string;
  end: string;
  isMobile: boolean;
}

function SubjectReportPopover({
  loading,
  disabled,
  subjects,
  buildings,
  start,
  end,
  isMobile,
}: SubjectReportPopoverProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<Option[]>([]);
  const {
    loading: loadingClasses,
    classes,
    getClassesBySubjects,
  } = useClasses(false);

  console.log(classes);

  return (
    <Popover placement='top' closeOnBlur={false}>
      <PopoverTrigger>
        <Button
          w={'full'}
          isLoading={loading}
          disabled={disabled}
          fontWeight={'bold'}
          variant={'outline'}
          colorScheme={'blue'}
          color={'uspolis.blue'}
          leftIcon={<DownloadIcon />}
        >
          Alocação de disciplinas escolhidas
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          maxW={isMobile ? '100%' : '800px'}
          w={isMobile ? '100vw' : '800px'}
          h={'500px'}
        >
          <PopoverArrow />
          <PopoverHeader fontWeight={'bold'} fontSize={'lg'} maxH={'50px'}>
            Alocações de Disciplinas
          </PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody overflowY={'auto'} maxH={'400px'} h={'full'}>
            <Flex direction={'column'} gap={'10px'}>
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
                onChange={(selected) => {
                  if (selected) {
                    setSelectedSubjects(selected as Option[]);
                  }
                }}
                options={subjects.map((subject) => ({
                  value: subject.id,
                  label: `${subject.code} - ${subject.name}`,
                }))}
                maxMenuHeight={100}
                styles={{
                  control: (base) => ({
                    ...base,
                    maxHeight: '150px',
                    overflowY: 'auto',
                  }),
                }}
              />
            </Flex>
          </PopoverBody>
          <PopoverFooter maxH={'60px'}>
            <Flex justify={'flex-end'} align={'center'} gap={'10px'}>
              {selectedSubjects.length == 0 && (
                <Alert
                  status='error'
                  h={isMobile ? '50px' : 'full'}
                  w={'fit-content'}
                  borderRadius={'10px'}
                >
                  <AlertIcon />
                  {isMobile
                    ? 'Selecione disciplinas'
                    : 'Selecione pelo menos uma disciplina para continuar!'}
                </Alert>
              )}
              <Button
                onClick={() =>
                  getClassesBySubjects(
                    selectedSubjects.map((s) => s.value),
                    start,
                    end,
                  )
                }
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
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

export default SubjectReportPopover;
