import { ChevronDownIcon, LockIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ClassesPDF from '../../pdf/ClassesPDF/classesPDF';
import ClassroomsPDF from '../../pdf/ClassroomsPDF/classroomsPDF';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { appContext } from 'context/AppContext';
import { AllocationHeaderProps } from '..';
import HeaderFilter from '../HeaderFilter/header.filter';

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
  resources,
}: AllocationHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedUser } = useContext(appContext);

  return (
    <Flex direction={'column'} alignItems={'flex-start'} gap={2} w={'100%'}>
      <Text fontSize={'4xl'}>Mapa de Salas</Text>
      <Flex
        mb={4}
        // divider={<StackDivider />}
        justifyContent='flex-end'
        gap={4}
        direction={'row'}
        w={'full'}
      >
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            colorScheme='blue'
            ml={'0px'}
          >
            Baixar
          </MenuButton>
          <MenuList zIndex={99999}>
            <MenuItem>
              <PDFDownloadLink
                document={<ClassesPDF classes={[]} />}
                fileName='disciplinas.pdf'
              >
                Baixar mapa de disciplinas
              </PDFDownloadLink>
            </MenuItem>
            <MenuItem>
              <PDFDownloadLink
                document={<ClassroomsPDF classes={[]} reservations={[]} />}
                fileName='salas.pdf'
              >
                Baixar mapa de salas
              </PDFDownloadLink>
            </MenuItem>
          </MenuList>
        </Menu>
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
          resources={resources}
        />
      </Flex>
    </Flex>
  );
}

export default AllocationDesktopHeader;
