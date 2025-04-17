import { LockIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Spacer,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { appContext } from '../../../../context/AppContext';
import { AllocationHeaderProps } from '..';
import HeaderFilter from '../HeaderFilter/header.filter';
import HeaderPDFOptions from '../HeaderPDFOptions/headerPDF.options';

function AllocationDesktopHeader({
  isOpen,
  onOpen,
  onClose,
  buildingSearchValue,
  setBuildingSearchValue,
  classroomSearchValue,
  setClassroomSearchValue,
  nameSearchValue,
  setNameSearchValue,
  classSearchValue,
  setClassSearchValue,
  events,
  buildingResources,
  classroomResources,
}: AllocationHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedUser } = useContext(appContext);
  const {
    isOpen: isOpenPDF,
    onClose: onClosePDF,
    onOpen: onOpenPDF,
  } = useDisclosure();

  return (
    <Flex direction={'column'} alignItems={'flex-start'} gap={2} w={'100%'}>
      <HeaderPDFOptions
        isOpen={isOpenPDF}
        onClose={onClosePDF}
        buildings={buildingResources.map((resource) => ({
          label: resource.title,
          value: resource.id,
        }))}
      />
      <Text fontSize={'4xl'}>Mapa de Salas</Text>
      <Flex
        mb={4}
        justifyContent='flex-end'
        gap={4}
        direction={'row'}
        w={'full'}
      >
        <Button colorScheme='blue' onClick={onOpenPDF}>
          Baixar
        </Button>
        <Tooltip label={loggedUser ? '' : 'Entre para poder fazer essa ação.'}>
          <Button
            colorScheme='blue'
            onClick={() => {
              if (!loggedUser) {
                navigate('/auth', {
                  replace: true,
                  state: { from: location },
                });
              }
              onOpen();
            }}
            leftIcon={loggedUser ? undefined : <LockIcon />}
          >
            Solicitar Sala
          </Button>
        </Tooltip>

        <Spacer />

        <HeaderFilter
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          buildingSearchValue={buildingSearchValue}
          setBuildingSearchValue={setBuildingSearchValue}
          classroomSearchValue={classroomSearchValue}
          setClassroomSearchValue={setClassroomSearchValue}
          nameSearchValue={nameSearchValue}
          setNameSearchValue={setNameSearchValue}
          classSearchValue={classSearchValue}
          setClassSearchValue={setClassSearchValue}
          events={events}
          buildingResources={buildingResources}
          classroomResources={classroomResources}
        />
      </Flex>
    </Flex>
  );
}

export default AllocationDesktopHeader;
