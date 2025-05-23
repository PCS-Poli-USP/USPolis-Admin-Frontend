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
import PageContent from 'components/common/PageContent';
import GroupAccordion from './GroupAccordion/group.accordion';
import { MdGroupAdd } from 'react-icons/md';
import GroupModal from './GroupModal/group.modal';
import useClassrooms from 'hooks/useClassrooms';
import useUsers from 'hooks/useUsers';
import { useEffect, useState } from 'react';
import useGroups from 'hooks/useGroups';
import { GroupResponse } from 'models/http/responses/group.response.models';
import Dialog from 'components/common/Dialog/dialog.component';
import useBuildings from 'hooks/useBuildings';
import { filterString } from 'utils/filters';
import { BsSearch } from 'react-icons/bs';

export function Groups() {
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
    getAllGroups,
    deleteGroup,
  } = useGroups();
  const {
    buildings,
    loading: loadingBuildings,
    getAllBuildings,
  } = useBuildings(false);

  const [selectedGroup, setSelectedGroup] = useState<GroupResponse>();
  const [filteredGroups, setFilteredGroups] = useState<GroupResponse[]>([]);

  function fetchData() {
    getAllBuildings();
    getAllClassrooms();
    getUsers();
  }

  function filterGroups(value: string) {
    const filtered = groups.filter(
      (group) =>
        filterString(group.name, value) ||
        filterString(group.abbreviation, value),
    );
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
        refetch={() => {
          getAllGroups();
        }}
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
            placeholder='Filtrar por grupo'
            onChange={(event) => {
              filterGroups(event.target.value);
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
          groups={filteredGroups.length > 0 ? filteredGroups : groups}
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
