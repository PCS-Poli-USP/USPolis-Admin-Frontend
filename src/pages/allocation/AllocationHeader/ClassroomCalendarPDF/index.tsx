import {
  Flex,
  Text,
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
import { useEffect, useState } from 'react';
import { BuildingResponse } from '../../../../models/http/responses/building.response.models';
import useClasses from '../../../../hooks/classes/useClasses';
import { ModalProps } from '../../../../models/interfaces';
import { getEndOfSemester, getStartOfSemester } from '../utils';
import ClassroomsCalendarPDF from '../../pdf/ClassroomsCalendarPDF/classrooms.calendar.pdf';
import useReservations from '../../../../hooks/reservations/useReservations';

interface ClassroomPDFModalProps extends ModalProps {
  buildings: BuildingResponse[];
}

function ClassroomPDFModal({
  isOpen,
  onClose,
  buildings,
}: ClassroomPDFModalProps) {
  const {
    loading: loadingClasses,
    classes,
    getClassesByBuildingName,
  } = useClasses(false);
  const {
    loading: loadingR,
    reservations,
    getReservationsByBuildingName,
  } = useReservations(false);

  const [selectedBuilding, setSelectedBuilding] = useState<Option | null>(null);
  const [start, setStart] = useState<string>(getStartOfSemester());
  const [end, setEnd] = useState<string>(getEndOfSemester());

  useEffect(() => {
    if (selectedBuilding && start && end) {
      getClassesByBuildingName(selectedBuilding.label, start, end);
      getReservationsByBuildingName(selectedBuilding.label, start, end);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBuilding, start, end]);

  function handleClose() {
    setSelectedBuilding(null);
    setStart(getStartOfSemester());
    setEnd(getEndOfSemester());
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size={'lg'}>
      <ModalOverlay />

      <ModalContent h={'600px'} bg={'uspolis.white'}>
        <ModalHeader fontWeight={'bold'} fontSize={'lg'} maxH={'50px'}>
          Alocações de Disciplinas
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY={'auto'} h={'full'}>
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
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter maxH={'80px'}>
          <Flex justify={'flex-end'} align={'center'} gap={'10px'}>
            <ClassroomsCalendarPDF
              classes={classes}
              reservations={reservations}
              building={selectedBuilding ? selectedBuilding.label : ''}
              disabled={
                !selectedBuilding ||
                loadingClasses ||
                loadingR ||
                !start ||
                !end
              }
              loading={loadingClasses || loadingR}
              startDate={start}
              endDate={end}
            />
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ClassroomPDFModal;
