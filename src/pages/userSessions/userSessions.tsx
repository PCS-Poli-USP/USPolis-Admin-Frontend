import { Skeleton, useDisclosure } from '@chakra-ui/react';
import DataTable from '../../components/common/DataTable/dataTable.component';
import PageContent from '../../components/common/PageContent';
import PageHeader from '../../components/common/PageHeader';
import useUsersSessions from '../../hooks/usersSessions/useUsersSessions';
import { getUserSessionsColumns } from './Tables/userSession.table';
import Dialog from '../../components/common/Dialog/dialog.component';
import { useState } from 'react';
import { UserSessionResponse } from '../../models/http/responses/userSession.response.models';

function UserSessions() {
  const { loading, sessions, deleteUserSession } = useUsersSessions();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedSesstion, setSelectedSession] =
    useState<UserSessionResponse>();

  const columns = getUserSessionsColumns({
    handleDeleteClick: (data) => {
      setSelectedSession(data);
      onOpen();
    },
    isLoading: false,
  });

  return (
    <PageContent>
      <Dialog
        title={`Deseja remover essa seção de usuário?`}
        warningText='Uma vez feita essa ação não poderá ser desfeita!'
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => {
          onClose();
          if (selectedSesstion) {
            deleteUserSession(selectedSesstion.id);
          }
        }}
      />
      <PageHeader title='Sessões de Usuários' />
      <Skeleton isLoaded={!loading} w='100%'>
        <DataTable data={sessions} columns={columns} />
      </Skeleton>
    </PageContent>
  );
}

export default UserSessions;
