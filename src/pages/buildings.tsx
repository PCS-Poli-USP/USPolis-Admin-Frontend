import React, { useContext, useEffect } from 'react';
import * as C from '@chakra-ui/react';

import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';

import { ColumnDef } from '@tanstack/react-table';
import Navbar from 'components/common/navbar.component';
import BuildingsService from 'services/buildings.service';
import {
  Building,
  CreateBuilding,
  UpdateBuilding,
} from 'models/building.model';
import RegisterModal from 'components/buildings/register.modal';
import Dialog from 'components/common/dialog.component';
import DataTable from 'components/common/dataTable.component';
import { appContext } from 'context/AppContext';
import { sortBuildings } from 'utils/sorter';

const Buildings = () => {
  const { setLoading } = useContext(appContext);
  const buildingsService = new BuildingsService();

  const [buildings, setBuildings] = React.useState<Building[]>([]);
  const [contextBuilding, setContextBuilding] = React.useState<Building | null>(
    null,
  );
  const [registerModalOpen, setRegisterModalOpen] =
    React.useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] =
    React.useState<boolean>(false);
  const [isUpdate, setIsUpdate] = React.useState<boolean>(false);

  const toast = C.useToast();
  const toastSuccess = (message: string) => {
    toast({
      position: 'top-left',
      title: 'Sucesso!',
      description: message,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  const toastError = (message: string) => {
    toast({
      position: 'top-left',
      title: 'Erro!',
      description: message,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const columns: ColumnDef<Building>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'updated_at',
      header: 'Atualizado em',
    },
    {
      id: 'options',
      header: 'Opções',
      cell: ({ row }) => (
        <C.HStack spacing='0px' width='fit-content'>
          <C.Tooltip label='Editar'>
            <C.IconButton
              colorScheme='yellow'
              size='xs'
              variant='ghost'
              aria-label='editar-predio'
              icon={<BsFillPenFill />}
              onClick={() => handleEditButton(row.original)}
            />
          </C.Tooltip>
       
          <C.Tooltip label='Deletar'>
            <C.IconButton
              colorScheme='red'
              size='xs'
              variant='ghost'
              aria-label='deletar-predio'
              icon={<BsFillTrashFill />}
              onClick={() => handleDeleteButton(row.original)}
            />
          </C.Tooltip>
        </C.HStack>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    fetchBuildings();
  }, []);

  async function fetchBuildings() {
    try {
      const response = await buildingsService.list();
      console.log(response.data);
      setBuildings(response.data.sort(sortBuildings));
      setLoading(false);
    } catch (err) {
      console.log('err');
      console.error(err);
      setTimeout(() => {
        fetchBuildings();
      }, 1000);
    }
  }

  async function createBuilding(data: CreateBuilding) {
    try {
      setLoading(true);
      const response = await buildingsService.create(data);
      toastSuccess('Pédio criado com sucesso')
      fetchBuildings();
    } catch (err) {
      console.error(err);
      toastError('Erro ao criar prédio')
      setLoading(false);
    }
  }

  async function editBuilding(id: string, data: CreateBuilding) {
    try {
      setLoading(true);
      await buildingsService.update(id, data);
      fetchBuildings();
    } catch (err) {
      console.error(err);
      toastError('Erro ao editar prédio');
      setLoading(false);
    }
  }

  async function deleteBuilding(id: string) {
    try {
      setLoading(true);
      await buildingsService.delete(id);
      fetchBuildings();
    } catch (err) {
      console.error(err);
      toastError(`Erro ao deletar prédio`);
      setLoading(false);
    }
  }

  function handleCreateButton() {
    setIsUpdate(false);
    setRegisterModalOpen(true);
  }

  function handleEditButton(building: Building) {
    setIsUpdate(true);
    setContextBuilding(building);
    setRegisterModalOpen(true);
  }

  function handleDeleteButton(building: Building) {
    setContextBuilding(building);
    setDeleteDialogOpen(true);
  }

  function handleRegisterSave(data: UpdateBuilding | CreateBuilding) {
    if (isUpdate) {
      editBuilding(contextBuilding?.id as string, data as CreateBuilding);
    } else {
      createBuilding(data as CreateBuilding);
    }
  }

  return (
    <>
      <Navbar />
      <C.Flex paddingX={4} direction={'column'}>
        <C.Flex justifyContent={'space-between'} alignItems={'center'}>
          <C.Text fontSize='4xl' mb={4}>
            Prédios
          </C.Text>
          <C.Button onClick={handleCreateButton}>Cadastrar</C.Button>
        </C.Flex>
        <DataTable columns={columns} data={buildings} />
      </C.Flex>
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => {
          setRegisterModalOpen(false);
          setContextBuilding(null);
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
          deleteBuilding(contextBuilding?.id as string);
          setDeleteDialogOpen(false);
        }}
        title={`Deletar o prédio ${contextBuilding?.name}`}
      />
    </>
  );
};

export default Buildings;
