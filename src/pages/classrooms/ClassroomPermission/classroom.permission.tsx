import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  AlertIcon,
  AlertTitle,
  Alert,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { ModalProps } from '../../../models/interfaces';
import { SmallCloseIcon } from '@chakra-ui/icons';
import ClassroomPermissionAccordion from './ClassroomPermissionAccordion/classroom.permission.accordion';
import { BsSearch } from 'react-icons/bs';
import { useState } from 'react';
import { UserCoreResponse } from '../../../models/http/responses/user.response.models';
import {
  ClassroomPermissionByClassroomResponse,
  ClassroomPermissionByUserResponse,
} from '../../../models/http/responses/classroomPermission.response.models';
import { filterString } from '../../../utils/filters';
import UserClassroomPermissionAccordion from './UserClassroomPermissionAccordion/user.classroom.permission.accordion';
import { ClassroomResponse } from '../../../models/http/responses/classroom.response.models';
import TooltipSelect from '../../../components/common/TooltipSelect';

interface ClassroomPermissionsProps extends ModalProps {
  users: UserCoreResponse[];
  classrooms: ClassroomResponse[];
  permissionsByClassrooms: ClassroomPermissionByClassroomResponse[];
  permissionsByUsers: ClassroomPermissionByUserResponse[];
  loading: boolean;
  refetch: () => void;
}

function ClassroomPermissions({
  users,
  classrooms,
  isOpen,
  onClose,
  permissionsByClassrooms,
  permissionsByUsers,
  refetch,
  loading,
}: ClassroomPermissionsProps) {
  const [buildingSearch, setBuildingSearch] = useState('');
  const [classroomSearch, setClassroomSearch] = useState('');
  const [selecteUserMap, setSelecteUserMap] = useState<
    Map<number, UserCoreResponse>
  >(new Map());

  function filterClassroomsPermissions() {
    const filtered = permissionsByClassrooms.filter(
      (permissions) =>
        filterString(permissions.classroom_name, classroomSearch) &&
        filterString(permissions.building_name, buildingSearch),
    );
    return filtered;
  }

  function filterUsersPermissions() {
    const filtered = permissionsByUsers.filter((val) =>
      selecteUserMap.has(val.user_id),
    );
    return filtered;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={'5xl'}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Gerenciar permissões de salas restritas</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab color={'uspolis.blue'} textColor={'uspolis.text'}>
                {' '}
                Salas de Aula
              </Tab>
              <Tab color={'uspolis.blue'} textColor={'uspolis.text'}>
                Usuários
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                {permissionsByClassrooms.length === 0 && (
                  <Alert status='warning'>
                    <AlertIcon />
                    <AlertTitle>Não há salas restritas cadastradas.</AlertTitle>
                  </Alert>
                )}
                {permissionsByClassrooms.length > 0 && (
                  <Flex direction={'column'} width={'full'} gap={'20px'}>
                    <Flex gap={'10px'}>
                      <InputGroup borderColor={'uspolis.blue'} w={'300px'}>
                        <InputLeftElement pointerEvents='none'>
                          <BsSearch color='gray.300' />
                        </InputLeftElement>
                        <Input
                          type='text'
                          placeholder='Filtrar por prédio'
                          value={buildingSearch}
                          border={buildingSearch ? '1px solid' : undefined}
                          onChange={(event) => {
                            setBuildingSearch(event.target.value);
                          }}
                          disabled={loading}
                        />
                        {loading && (
                          <InputRightElement width='4.5rem'>
                            {/* The spinner will appear inside the input on the right */}
                            <Spinner size='sm' />
                          </InputRightElement>
                        )}
                      </InputGroup>
                      <InputGroup borderColor={'uspolis.blue'} w={'300px'}>
                        <InputLeftElement pointerEvents='none'>
                          <BsSearch color='gray.300' />
                        </InputLeftElement>
                        <Input
                          type='text'
                          placeholder='Filtrar por sala'
                          value={classroomSearch}
                          border={classroomSearch ? '1px solid' : undefined}
                          onChange={(event) => {
                            setClassroomSearch(event.target.value);
                          }}
                          disabled={loading}
                        />
                        {loading && (
                          <InputRightElement width='4.5rem'>
                            {/* The spinner will appear inside the input on the right */}
                            <Spinner size='sm' />
                          </InputRightElement>
                        )}
                      </InputGroup>
                    </Flex>
                    <ClassroomPermissionAccordion
                      users={users}
                      permissionsByClassroom={filterClassroomsPermissions()}
                      refetch={refetch}
                      loading={loading}
                    />
                  </Flex>
                )}
              </TabPanel>

              <TabPanel>
                {permissionsByUsers.length === 0 && (
                  <Alert status='warning'>
                    <AlertIcon />
                    <AlertTitle>
                      Não há usuários com permissões cadastradas.
                    </AlertTitle>
                  </Alert>
                )}
                {permissionsByUsers.length > 0 && (
                  <Flex direction={'column'} width={'full'} gap={'20px'}>
                    <TooltipSelect
                      placeholder='Selecionar usuários'
                      isMulti={true}
                      options={users.map((user) => ({
                        value: user.id,
                        label: `${user.name} (${user.email})`,
                      }))}
                      value={Array.from(selecteUserMap.values()).map(
                        (user) => ({
                          value: user.id,
                          label: `${user.name} (${user.email})`,
                        }),
                      )}
                      onChange={(options) => {
                        const newMap = new Map<number, UserCoreResponse>();
                        options.forEach((option) => {
                          const user = users.find(
                            (user) => user.id === option.value,
                          );
                          if (user) {
                            newMap.set(user.id, user);
                          }
                        });
                        setSelecteUserMap(newMap);
                      }}
                    />
                    <UserClassroomPermissionAccordion
                      classrooms={classrooms.filter(
                        (classroom) => classroom.restricted,
                      )}
                      permissionsByUser={filterUsersPermissions()}
                      refetch={refetch}
                      loading={loading}
                    />
                  </Flex>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme='blue'
            onClick={onClose}
            rightIcon={<SmallCloseIcon />}
          >
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ClassroomPermissions;
