import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import {
  CreateBuilding,
  UpdateBuilding,
} from '../../models/http/requests/building.request.models';
import BuildingModal from '../../pages/buildings/BuildingModal/building.modal';
import Dialog from '../../components/common/Dialog/dialog.component';
import DataTable from '../../components/common/DataTable/dataTable.component';
import { BuildingResponse } from '../../models/http/responses/building.response.models';
import { getBuildingsColumns } from './Tables/building.tables';
import useBuildings from '../../hooks/useBuildings';
import PageContent from '../../components/common/PageContent';
import BuildingCardList from './BuildingCardList';

const Buildings = () => {
  const [contextBuilding, setContextBuilding] = useState<
    BuildingResponse | undefined
  >(undefined);
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const { loading, buildings, createBuilding, updateBuilding, deleteBuilding } =
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
    <PageContent horizontalScroll>
      <Box w="100%" minW="344px">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'stretch', md: 'center' }}
          gap={3}
          mb={4}
          w="full"
        >
          <Text fontSize={{ base: '24px', md: '4xl' }} color="uspolis.text">
            Prédios
          </Text>
          <Box flex={1} display={{ base: 'none', md: 'block' }} />
          <Button
            display={{ base: 'none', md: 'inline-flex' }}
            onClick={handleCreateButton}
            colorScheme="blue"
          >
            Cadastrar
          </Button>
        </Flex>
        <Box display={{ base: 'none', md: 'block' }} w="100%">
          <DataTable loading={loading} columns={columns} data={buildings} />
        </Box>
        <Box display={{ base: 'block', md: 'none' }} w="100%">
          <BuildingCardList
            buildings={buildings}
            loading={loading}
            onEdit={handleEditButton}
            onDelete={handleDeleteButton}
            toolbarAction={
              <Button
                colorScheme="blue"
                leftIcon={<AddIcon />}
                onClick={handleCreateButton}
                w="full"
              >
                Cadastrar
              </Button>
            }
          />
        </Box>
      </Box>
      <BuildingModal
        isOpen={registerModalOpen}
        onClose={() => {
          setRegisterModalOpen(false);
          setContextBuilding(undefined);
          setIsUpdate(false);
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
    </PageContent>
  );
};

export default Buildings;
