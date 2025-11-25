import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import GroupAccordion from './GroupAccordion/group.accordion';
import { MdGroupAdd } from 'react-icons/md';
import GroupModal from './GroupModal/group.modal';
import useClassrooms from '../../hooks/classrooms/useClassrooms';
import useUsers from '../../hooks/users/useUsers';
import { useEffect, useState } from 'react';
import useGroups from '../../hooks/groups/useGroups';
import { GroupResponse } from '../../models/http/responses/group.response.models';
import Dialog from '../../components/common/Dialog/dialog.component';
import useBuildings from '../../hooks/useBuildings';
import { filterString } from '../../utils/filters';
import { BsSearch } from 'react-icons/bs';

export default function Groups() {
  const {
    isOpen: isOpenGroupModal,
    onOpen: onOpenGroupModal,
    onClose: onCloseGroupModal,
  } = useDisclosure();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const {
    classrooms,
    loading: loadingClassrooms,
    getAllClassrooms,
  } = useClassrooms(false);
  const { users, loading: loadingUsers, getUsers } = useUsers(false);
  const {
    groups,
    loading: loadingGroups,
    createGroup,
    updateGroup,
    deleteGroup,
  } = useGroups();
  const {
    buildings,
    loading: loadingBuildings,
    getAllBuildings,
  } = useBuildings(false);

  const [filterBuilding, setFilterBuilding] = useState<string>('');
  const [filterName, setFilterName] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<GroupResponse>();
  const [filteredGroups, setFilteredGroups] = useState<GroupResponse[]>([]);

  function fetchData() {
    getAllBuildings();
    getAllClassrooms();
    getUsers();
  }

  function filterGroups(building: string, name: string) {
    const filtered = groups.filter((group) => {
      const matchBuilding = filterString(group.building, building);
      const matchName = filterString(group.name, name);
      return matchBuilding && matchName;
    });
    setFilteredGroups(filtered);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContent>
      <GroupModal
        isOpen={isOpenGroupModal}
        onClose={() => {
          onCloseGroupModal();
          setSelectedGroup(undefined);
        }}
        isUpdate={!!selectedGroup}
        group={selectedGroup}
        buildings={buildings}
        classrooms={classrooms}
        users={users}
        createGroup={createGroup}
        updateGroup={updateGroup}
      />
      <Dialog
        title={'Remover grupo'}
        warningText={
          'Essa ação é irreversível e impacta diretamente os usuários!'
        }
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => {
          if (selectedGroup) {
            deleteGroup(selectedGroup.id);
            setSelectedGroup(undefined);
          }
          onClose();
        }}
      />
      <Flex align={'center'}>
        <Text fontSize={'4xl'}>Grupos</Text>
        <InputGroup ml={'40px'} w={'fit-content'}>
          <InputLeftElement pointerEvents='none'>
            <BsSearch color='gray.300' />
          </InputLeftElement>
          <Input
            type='text'
            placeholder='Filtrar por prédio'
            onChange={(event) => {
              setFilterBuilding(event.target.value);
              filterGroups(event.target.value, filterName);
            }}
          />
        </InputGroup>
        <InputGroup ml={'40px'} w={'fit-content'}>
          <InputLeftElement pointerEvents='none'>
            <BsSearch color='gray.300' />
          </InputLeftElement>
          <Input
            type='text'
            placeholder='Filtrar por grupo'
            onChange={(event) => {
              setFilterName(event.target.value);
              filterGroups(filterBuilding, event.target.value);
            }}
          />
        </InputGroup>
        <Spacer />
        <Button
          colorScheme={'blue'}
          onClick={onOpenGroupModal}
          leftIcon={<MdGroupAdd />}
        >
          Adicionar
        </Button>
      </Flex>
      <Skeleton
        mt={'15px'}
        isLoaded={
          !loadingGroups &&
          !loadingClassrooms &&
          !loadingUsers &&
          !loadingBuildings
        }
        minH={'100px'}
      >
        <GroupAccordion
          groups={filterBuilding || filterName ? filteredGroups : groups}
          onGroupUpdate={(group) => {
            setSelectedGroup(group);
            onOpenGroupModal();
          }}
          onGroupDelete={(group) => {
            setSelectedGroup(group);
            onOpen();
          }}
        />
      </Skeleton>
    </PageContent>
  );
}
