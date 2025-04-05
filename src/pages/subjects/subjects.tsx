import DataTable from 'components/common/DataTable/dataTable.component';
import { Button, Flex, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import Dialog from 'components/common/Dialog/dialog.component';
import { SubjectResponse } from 'models/http/responses/subject.response.models';
import { getSubjectColumns } from './Tables/subject.table';
import useSubjects from 'hooks/useSubjetcts';
import SubjectModal from './SubjectModal/subject.modal';
import useBuildings from 'hooks/useBuildings';
import PageContent from 'components/common/PageContent';
import { UsersValidator } from 'utils/users/users.validator';
import { appContext } from 'context/AppContext';

function Subjects() {
  const context = useContext(appContext);
  const { loading, subjects, getSubjects, deleteSubject } = useSubjects();

  const disableMap: boolean[] = subjects.map(
    (subject) =>
      !UsersValidator.checkUserBuildingPermission(
        context.loggedUser,
        subject.building_ids,
      ),
  );

  const columns = getSubjectColumns({
    handleEditButton: handleEditSubjectButton,
    handleDeleteButton: handleDeleteSubjectButton,
    handleDuplicateClick: handleDuplicateClick,
    disableMap: disableMap,
  });

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

  const { buildings } = useBuildings();

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

  function handleDuplicateClick(data: SubjectResponse) {
    setIsUpdateSubject(false);
    setSelectedSubject(data);
    onOpenRegisterSubjectModal();
  }

  return (
    <PageContent>
      <Flex align='center'>
        <Text fontSize={'4xl'} mb={4}>
          Disciplinas
        </Text>
        <Spacer />
        <Button onClick={handleCreateSubjectButton} colorScheme={'blue'}>
          Cadastrar
        </Button>
      </Flex>
      <DataTable
        loading={loading}
        data={subjects}
        columns={columns}
        columnPinning={{ left: ['id', 'code'], right: ['options'] }}
      />
      <SubjectModal
        buildings={buildings}
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
    </PageContent>
  );
}

export default Subjects;
