import React, { useEffect } from 'react';
import { Auth } from 'aws-amplify';
import * as C from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import Navbar from 'components/common/navbar.component';
import BuildingsService from 'services/buildings.service';
import { Building, CreateBuilding, UpdateBuilding } from 'models/building.model';
import RegisterModal from 'components/buildings/register.modal';
import Dialog from 'components/common/dialog.component';
import { FaEllipsisV } from 'react-icons/fa';
import DataTable from 'components/common/dataTable.component';

const Buildings = () => {
  const buildingsService = new BuildingsService();

  const [buildings, setBuildings] = React.useState<Building[]>([]);
  const [contextBuilding, setContextBuilding] = React.useState<Building | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = React.useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);
  const [isUpdate, setIsUpdate] = React.useState<boolean>(false);

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
      meta: { isNumeric: true },
      cell: ({ row }) => (
        <C.Menu>
          <C.MenuButton as={C.IconButton} aria-label='Options' icon={<C.Icon as={FaEllipsisV} />} variant='ghost' />
          <C.MenuList>
            <C.MenuItem onClick={() => handleEditButton(row.original)}>Editar</C.MenuItem>
            <C.MenuItem onClick={() => handleDeleteButton(row.original)}>Deletar</C.MenuItem>
          </C.MenuList>
        </C.Menu>
      ),
    },
  ];

  useEffect(() => {
    fetchBuildings();
  }, []);

  async function fetchBuildings() {
    try {
      const response = await buildingsService.list();
      console.log(response.data);
      setBuildings(response.data);
    } catch (err) {
      console.log('err');
      console.error(err);
    }
  }

  async function createBuilding(data: CreateBuilding) {
    try {
      const response = await buildingsService.create(data);
      fetchBuildings();
    } catch (err) {
      console.error(err);
    }
  }

  async function editBuilding(id: string, data: CreateBuilding) {
    try {
      const _ = await buildingsService.update(id, data);
      fetchBuildings();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteBuilding(id: string) {
    try {
      const _ = await buildingsService.delete(id);
      fetchBuildings();
    } catch (err) {
      console.error(err);
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
        title={'Deseja deletar o prédio?'}
      />
    </>
  );
};

export default Buildings;
