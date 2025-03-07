import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Heading,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ClassesPDF from '../../pdf/ClassesPDF/classesPDF';
import ClassroomsPDF from '../../pdf/ClassroomsPDF/classroomsPDF';
import Select from 'react-select';
import { useState } from 'react';
import useClasses from 'hooks/classes/useClasses';
import { normalizeString } from 'utils/formatters';
import useReservations from 'hooks/useReservations';
import { Recurrence } from 'utils/enums/recurrence.enum';

type Option = {
  value: string;
  label: string;
};
interface PDFOptionsProps {
  buildings: Option[];
}

function HeaderPDFOptions({ buildings }: PDFOptionsProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<Option | null>(null);
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

  return (
    <Popover placement='bottom-end'>
      <PopoverTrigger>
        <Button rightIcon={<ChevronDownIcon />} colorScheme='blue'>
          Baixar
        </Button>
      </PopoverTrigger>
      <PopoverContent borderWidth={'2px'}>
        <PopoverCloseButton />
        <PopoverHeader>Baixe alocações e relatórios</PopoverHeader>
        <Stack
          direction={'column'}
          align={'flex-start'}
          justify={'center'}
          p={'5px'}
          divider={<StackDivider />}
          mb={'10px'}
        >
          <Box w={'full'}>
            <Select
              placeholder={'Selecione um prédio'}
              options={buildings}
              isClearable={true}
              onChange={(option: Option | null) => {
                setSelectedBuilding(option);
                if (option) {
                  getClassesByBuildingName(option.label);
                  getReservationsByBuildingName(option.label);
                }
              }}
            />
            {!selectedBuilding && (
              <Text color={'red.500'} ml={'5px'} mt={'5px'}>
                Selecione um prédio antes!
              </Text>
            )}
          </Box>

          <Heading size={'md'} ml={'5px'}>
            Alocações gerais
          </Heading>

          <Box w={'full'}>
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
                isLoading={loadingC || loadingR}
                disabled={!selectedBuilding}
                variant={'outline'}
                textColor={'uspolis.blue'}
              >
                Baixar alocação das disciplinas
              </Button>
            </PDFDownloadLink>
          </Box>

          <Box w={'full'}>
            <PDFDownloadLink
              document={
                <ClassroomsPDF
                  classes={classes.map((cls) => ({
                    ...cls,
                    schedules: cls.schedules.filter(
                      (schedule) => schedule.allocated,
                    ),
                  }))}
                  reservations={reservations.filter(
                    (reservation) =>
                      reservation.schedule.recurrence !== Recurrence.CUSTOM,
                  )}
                  subtitle={'Alocação Planejada'}
                />
              }
              fileName={
                selectedBuilding
                  ? `salas-${normalizeString(selectedBuilding.label)}.pdf`
                  : 'salas.pdf'
              }
            >
              <Button
                w={'full'}
                isLoading={loadingC || loadingR}
                disabled={!selectedBuilding}
                variant={'outline'}
                textColor={'uspolis.blue'}
              >
                Baixar alocação das salas
              </Button>
            </PDFDownloadLink>
          </Box>

          {/* <Heading size={'md'} ml={'5px'}>
            Alocações semanais
          </Heading>

          <Box w={'full'}>
            <Text>Selecione uma semana:</Text>
            <Input type='date' disabled={!selectedBuilding} />
          </Box> */}
        </Stack>
      </PopoverContent>
    </Popover>
  );
}

export default HeaderPDFOptions;
