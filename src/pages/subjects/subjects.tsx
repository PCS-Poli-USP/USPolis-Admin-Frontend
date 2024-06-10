import Navbar from 'components/common/NavBar/navbar.component';
import DataTable from 'components/common/DataTable/dataTable.component';
import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import Dialog from 'components/common/Dialog/dialog.component';
import { SubjectResponse } from 'models/http/responses/subject.response.models';
import { getSubjectColumns } from './Tables/subject.table';
import useSubjects from 'hooks/useSubjetcts';
import SubjectModal from './SubjectModal/subject.modal';

function Subjects() {
  const columns = getSubjectColumns({
    handleEditButton: handleEditSubjectButton,
    handleDeleteButton: handleDeleteSubjectButton,
  });

  const { subjects, getSubjects, deleteSubject } = useSubjects();

  const {
    isOpen: isOpenRegisterSubjectModal,
    onOpen: onOpenRegisterSubjectModal,
    onClose: onCloseRegisterSubjectModal,
  } = useDisclosure();

  const {
    isOpen: isOpenDeleteSubjectDialog,
    onOpen: onOpenDeleteSubjectDialog,
    onClose: onCloseDeleteSubjectDialog,
  } = useDisclosure();

  const [isUpdateSubject, setIsUpdateSubject] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<
    SubjectResponse | undefined
  >(undefined);

  function handleCreateSubjectButton() {
    setIsUpdateSubject(false);
    onOpenRegisterSubjectModal();
  }

  function handleEditSubjectButton(data: SubjectResponse) {
    setIsUpdateSubject(true);
    setSelectedSubject(data);
    onOpenRegisterSubjectModal();
  }

  function handleDeleteSubjectButton(data: SubjectResponse) {
    onOpenDeleteSubjectDialog();
    setSelectedSubject(data);
  }

  async function handleDeleteSubject() {
    if (!selectedSubject) return;
    deleteSubject(selectedSubject.id);
    getSubjects();
  }

  return (
    <>
      <Navbar />
      <Flex paddingX={4} direction={'column'}>
        <Flex justifyContent={'space-between'} alignItems={'center'}>
          <Text fontSize={'4xl'} mb={4}>
            Disciplinas
          </Text>
          <Button onClick={handleCreateSubjectButton}>Cadastrar</Button>
        </Flex>
        <DataTable data={subjects} columns={columns} />
        <SubjectModal
          isOpen={isOpenRegisterSubjectModal}
          onClose={() => {
            setSelectedSubject(undefined);
            setIsUpdateSubject(false);
            onCloseRegisterSubjectModal();
          }}
          refetch={getSubjects}
          isUpdate={isUpdateSubject}
          selectedSubject={selectedSubject}
        />
        <Dialog
          title={`Deletar disciplina ${selectedSubject?.code}`}
          warningText={
            'Essa mudança é irreversível e irá apagar todas as turmas dessa disciplina, juntamente com suas alocações!'
          }
          isOpen={isOpenDeleteSubjectDialog}
          onClose={() => {
            setSelectedSubject(undefined);
            onCloseDeleteSubjectDialog();
          }}
          onConfirm={() => {
            handleDeleteSubject();
            setSelectedSubject(undefined);
            onCloseDeleteSubjectDialog();
          }}
        />
      </Flex>
    </>
  );
}

export default Subjects;
