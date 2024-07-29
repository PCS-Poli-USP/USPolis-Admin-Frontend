import {
  Box,
  Button,
  Center,
  Flex,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import DataTable from 'components/common/DataTable/dataTable.component';
import Dialog from 'components/common/Dialog/dialog.component';
import Navbar from 'components/common/NavBar/navbar.component';
import { useState } from 'react';
import ClassroomModal from './ClassroomModal/classroom.modal';
import useBuildings from 'hooks/useBuildings';
import useClassrooms from 'hooks/useClassrooms';
import { ClassroomResponse } from 'models/http/responses/classroom.response.models';
import { getClassroomColumns } from './Tables/classroom.tables';

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
  const { buildings } = useBuildings();
  const { classrooms, getClassrooms, deleteClassroom } = useClassrooms();

  const columns = getClassroomColumns({
    handleEditClick: handleEditClick,
    handleDeleteClick: handleDeleteClick,
  });

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
    <>
      <Navbar />
      <ClassroomModal
        isOpen={isOpenModal}
        onClose={onCloseModal}
        isUpdate={isUpdate}
        buildings={buildings}
        refetch={getClassrooms}
        selectedClassroom={selectedClassroom}
      />
      <Dialog
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onConfirm={handleDelete}
        title={`Deseja Remover ${selectedClassroom?.name}?`}
        warningText={
          'Essa ação é irreversível e irá desalocar todas turmas que usam essa sala'
        }
      />
      <Center>
        <Box p={4} w='9xl' overflowX='auto'>
          <Flex align='center'>
            <Text fontSize='4xl' mb={4}>
              Salas de aula
            </Text>
            <Spacer />
            <Button colorScheme='blue' onClick={handleCreateClick}>
              Cadastrar
            </Button>
          </Flex>
          <DataTable data={classrooms} columns={columns} />
        </Box>
      </Center>
    </>
  );
}
export default Classrooms;
