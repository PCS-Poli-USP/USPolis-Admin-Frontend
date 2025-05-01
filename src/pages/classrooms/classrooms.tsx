import {
  Box,
  Button,
  Flex,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import DataTable from '../../components/common/DataTable/dataTable.component';
import Dialog from '../../components/common/Dialog/dialog.component';
import { useState } from 'react';
import ClassroomModal from './ClassroomModal/classroom.modal';
import useBuildings from '../../hooks/useBuildings';
import useClassrooms from '../../hooks/useClassrooms';
import { ClassroomResponse } from '../../models/http/responses/classroom.response.models';
import { getClassroomColumns } from './Tables/classroom.tables';
import PageContent from '../../components/common/PageContent';
import useGroups from '../../hooks/groups/useGroups';

function Classrooms() {
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const [selectedClassroom, setSelectedClassroom] =
    useState<ClassroomResponse>();
  const [isUpdate, setIsUpdate] = useState(false);
  const { loading: loadingBuildings, buildings } = useBuildings();
  const { loading: loadingGroups, groups } = useGroups();
  const { loading, classrooms, getClassrooms, deleteClassroom } =
    useClassrooms();

  const columns = getClassroomColumns({
    handleDuplicateClick: handleDuplicateClick,
    handleEditClick: handleEditClick,
    handleDeleteClick: handleDeleteClick,
    isLoading: loading || loadingBuildings || loadingGroups,
  });

  function handleDuplicateClick(data: ClassroomResponse) {
    setSelectedClassroom(data);
    setIsUpdate(false);
    onOpenModal();
  }

  function handleDeleteClick(data: ClassroomResponse) {
    setSelectedClassroom(data);
    onOpenDelete();
  }

  function handleEditClick(data: ClassroomResponse) {
    setSelectedClassroom(data);
    setIsUpdate(true);
    onOpenModal();
  }

  function handleCreateClick() {
    setSelectedClassroom(undefined);
    setIsUpdate(false);
    onOpenModal();
  }

  function handleDelete() {
    if (selectedClassroom) {
      deleteClassroom(selectedClassroom.id);
    }
    onCloseDelete();
  }
  return (
    <PageContent>
      <ClassroomModal
        isOpen={isOpenModal}
        onClose={() => {
          onCloseModal();
          setSelectedClassroom(undefined);
          setIsUpdate(false);
        }}
        isUpdate={isUpdate}
        buildings={buildings}
        groups={groups}
        refetch={getClassrooms}
        selectedClassroom={selectedClassroom}
      />
      <Dialog
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onConfirm={handleDelete}
        title={`Deseja Remover ${selectedClassroom?.name}?`}
        warningText={
          'Essa ação é irreversível e irá desalocar todas turmas e apagará todas reservas que usam essa sala'
        }
      />
      <Box p={0} w='100%' overflowX='auto'>
        <Flex align='center'>
          <Text fontSize='4xl' mb={4}>
            Salas de aula
          </Text>
          <Spacer />
          <Button colorScheme='blue' onClick={handleCreateClick}>
            Cadastrar
          </Button>
        </Flex>
        <DataTable
          loading={loading || loadingBuildings || loadingGroups}
          data={classrooms}
          columns={columns}
          columnPinning={{ left: ['name'], right: ['options'] }}
        />
      </Box>
    </PageContent>
  );
}
export default Classrooms;
