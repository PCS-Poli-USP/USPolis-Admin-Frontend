import {
  Box,
  Button,
  Collapse,
  Flex,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, LockIcon } from '@chakra-ui/icons';

import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { appContext } from '../../../../context/AppContext';
import { AllocationHeaderProps } from '../index';
import HeaderPDFOptions from '../HeaderPDFOptions/headerPDF.options';
import HeaderFilter from '../HeaderFilter/header.filter';

function AllocationMobileHeader({
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

  const { isOpen: isOpenOptions, onToggle } = useDisclosure({
    defaultIsOpen: true,
  });
  const { isOpen: isOpenPDF, onClose: onClosePDF } = useDisclosure({
    defaultIsOpen: false,
  });
  return (
    <Flex direction={'column'} alignItems={'flex-start'} gap={5} w={'100%'}>
      <HeaderPDFOptions
        isOpen={isOpenPDF}
        onClose={onClosePDF}
        buildings={buildingResources.map((resource) => ({
          label: resource.title,
          value: resource.id,
        }))}
      />
      <Flex direction={'row'} gap={0} w={'100%'}>
        <Text fontSize={'2xl'}>Mapa de Salas</Text>
        <Button
          ml={'60px'}
          rightIcon={isOpenOptions ? <ChevronUpIcon /> : <ChevronDownIcon />}
          onClick={() => onToggle()}
        >
          {isOpenOptions ? 'Fechar' : 'Opções'}
        </Button>
      </Flex>
      <Collapse in={isOpenOptions} animateOpacity={true}>
        <Box rounded='md' w={'calc(100vw - 48px)'}>
          <Flex mb={4} gap={2} direction={'column'} w={'100%'}>
            <Flex direction={'row'} gap={5} w={'full'}>
              <Button onClick={() => onOpen()} colorScheme='blue'>
                Baixar
              </Button>
              <Tooltip
                label={loggedUser ? '' : 'Entre para poder fazer essa ação.'}
              >
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
            </Flex>

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
        </Box>
      </Collapse>
    </Flex>
  );
}
export default AllocationMobileHeader;
