import {
  Box,
  Button,
  Heading,
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
import Select from 'react-select';
import { useState } from 'react';
import useClasses from 'hooks/classes/useClasses';
import { normalizeString } from 'utils/formatters';
import useReservations from 'hooks/useReservations';
import ClassroomsCalendarPDF from 'pages/allocation/pdf/ClassroomsCalendarPDF/classrooms.calendar.pdf';
import { ModalProps } from 'models/interfaces';

type Option = {
  value: string;
  label: string;
};
interface PDFOptionsProps extends ModalProps {
  buildings: Option[];
}

function HeaderPDFOptions({ buildings, isOpen, onClose }: PDFOptionsProps) {
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
                    ? `disciplinas-${normalizeString(
                        selectedBuilding.label,
                      )}.pdf`
                    : 'disciplinas.pdf'
                }
              >
                <Button
                  w={'full'}
                  isLoading={loadingC || loadingR}
                  disabled={!selectedBuilding}
                  fontWeight={'bold'}
                  variant={'outline'}
                  colorScheme={'blue'}
                  color={'uspolis.blue'}
                >
                  Baixar alocação das disciplinas
                </Button>
              </PDFDownloadLink>
            </Box>

            <Box w={'full'}>
              <ClassroomsCalendarPDF
                classes={classes}
                reservations={reservations}
                building={selectedBuilding ? selectedBuilding.label : ''}
                disabled={!selectedBuilding || loadingC || loadingR}
                loading={loadingC || loadingR}
              />
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default HeaderPDFOptions;
