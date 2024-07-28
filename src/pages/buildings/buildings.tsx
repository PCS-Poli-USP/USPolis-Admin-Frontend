import { Button, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import Navbar from 'components/common/NavBar/navbar.component';
import {
  CreateBuilding,
  UpdateBuilding,
} from 'models/http/requests/building.request.models';
import RegisterModal from 'pages/buildings/RegisterModal/register.modal';
import Dialog from 'components/common/Dialog/dialog.component';
import DataTable from 'components/common/DataTable/dataTable.component';
import { BuildingResponse } from 'models/http/responses/building.response.models';
import { getBuildingsColumns } from './Tables/building.tables';
import useBuildings from 'hooks/useBuildings';

const Buildings = () => {
  const [contextBuilding, setContextBuilding] = useState<
    BuildingResponse | undefined
  >(undefined);
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const { buildings, createBuilding, updateBuilding, deleteBuilding } =
    useBuildings();

  const columns = getBuildingsColumns({
    handleEditButton: handleEditButton,
    handleDeleteButton: handleDeleteButton,
  });

  function handleCreateButton() {
    setIsUpdate(false);
    setRegisterModalOpen(true);
  }

  function handleEditButton(building: BuildingResponse) {
    setIsUpdate(true);
    setContextBuilding(building);
    setRegisterModalOpen(true);
  }

  function handleDeleteButton(building: BuildingResponse) {
    setContextBuilding(building);
    setDeleteDialogOpen(true);
  }

  function handleRegisterSave(data: UpdateBuilding | CreateBuilding) {
    if (isUpdate && contextBuilding) {
      updateBuilding(contextBuilding.id, data as UpdateBuilding);
    } else {
      createBuilding(data as CreateBuilding);
    }
  }

  return (
    <>
      <Navbar />
      <Flex paddingX={4} direction={'column'}>
        <Flex justifyContent={'space-between'} alignItems={'center'}>
          <Text fontSize='4xl' mb={4}>
            Prédios
          </Text>
          <Button onClick={handleCreateButton}>Cadastrar</Button>
        </Flex>
        <DataTable columns={columns} data={buildings} />
      </Flex>
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => {
          setRegisterModalOpen(false);
          setContextBuilding(undefined);
        }}
        onSave={handleRegisterSave}
        isUpdate={isUpdate}
        formData={contextBuilding ? { name: contextBuilding.name } : undefined}
      />
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
        }}
        onConfirm={() => {
          deleteBuilding(contextBuilding?.id as number);
          setDeleteDialogOpen(false);
        }}
        title={`Deletar o prédio ${contextBuilding?.name}`}
      />
    </>
  );
};

export default Buildings;