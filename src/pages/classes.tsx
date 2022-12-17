import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import HasToBeAllocatedDrawer from 'components/allocation/hasToBeAllocated.drawer';
import EditModal from 'components/classes/edit.modal';
import JupiterCrawlerPopover from 'components/classes/jupiterCrawler.popover';
import PreferencesModal from 'components/classes/preferences.modal';
import DataTable from 'components/common/dataTable.component';
import Dialog from 'components/common/dialog.component';
import Loading from 'components/common/loading.component';
import Navbar from 'components/common/navbar.component';
import { appContext } from 'context/AppContext';
import Class, { EditClassEvents, HasToBeAllocatedClass, Preferences } from 'models/class.model';
import { ErrorResponse } from 'models/interfaces/serverResponses';
import { useContext, useEffect, useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ClassesService from 'services/classes.service';
import EventsService from 'services/events.service';
import { Capitalize } from 'utils/formatters';
import { FilterArray, FilterNumber } from 'utils/tanstackTableHelpers/tableFiltersFns';

function Classes() {
  const [classesList, setClassesList] = useState<Array<Class>>([]);
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const { isOpen: isOpenPreferences, onOpen: onOpenPreferences, onClose: onClosePreferences } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure();
  const { isOpen: isOpenAlloc, onOpen: onOpenAlloc, onClose: onCloseAlloc } = useDisclosure();
  const [selectedClass, setSelectedClass] = useState<Class>();
  const { setLoading } = useContext(appContext);
  const [allocating, setAllocating] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const columns: ColumnDef<Class>[] = [
    {
      accessorKey: 'subject_code',
      header: 'Código',
    },
    {
      accessorKey: 'subject_name',
      header: 'Disciplina',
    },
    {
      accessorKey: 'class_code',
      header: 'Turma',
    },
    {
      accessorKey: 'subscribers',
      header: 'Nº Alunos',
      filterFn: FilterNumber,
    },
    {
      accessorKey: 'professors',
      header: 'Professores',
      cell: ({ row }) => (
        <Box>
          {row.original.professors?.map((professor, index) => (
            <Text key={professor + index}>{professor}</Text>
          ))}
        </Box>
      ),
      filterFn: FilterArray,
    },
    {
      accessorFn: (row) =>
        row.week_days?.map((day, index) => `${Capitalize(day)} ${row.start_time[index]} - ${row.end_time[index]}`),
      header: 'Horários',
      cell: (info) => (
        <Box>
          {(info.getValue() as string[])?.map((it) => (
            <Text key={it}>{it}</Text>
          ))}
        </Box>
      ),
      filterFn: FilterArray,
    },
    {
      id: 'options',
      meta: { isNumeric: true },
      cell: ({ row }) => (
        <Menu>
          <MenuButton as={IconButton} aria-label='Options' icon={<Icon as={FaEllipsisV} />} variant='ghost' />
          <MenuList>
            <MenuItem onClick={() => handleEditClick(row.original)}>Editar</MenuItem>
            <MenuItem onClick={() => handlePreferencesClick(row.original)}>Preferências</MenuItem>
            <MenuItem onClick={() => handleDeleteClick(row.original)}>Deletar</MenuItem>
          </MenuList>
        </Menu>
      ),
    },
  ];

  const classesService = new ClassesService();
  const eventsService = new EventsService();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  function fetchData() {
    setLoading(true);
    classesService.list().then((it) => {
      setClassesList(it.data);
      setLoading(false);
    });
  }

  function handleDeleteClick(obj: Class) {
    setSelectedClass(obj);
    onOpenDelete();
  }

  function handleDelete() {
    if (selectedClass) {
      classesService.delete(selectedClass.subject_code, selectedClass.class_code).then((it) => {
        console.log(it.data);
        onCloseDelete();
        fetchData();
      });
    }
  }

  function handlePreferencesClick(obj: Class) {
    setSelectedClass(obj);
    onOpenPreferences();
  }

  function handleSavePreferences(data: Preferences) {
    if (selectedClass) {
      classesService.patchPreferences(selectedClass.subject_code, selectedClass.class_code, data).then((it) => {
        console.log(it);
        fetchData();
      });
    }
  }

  function handleAllocClick() {
    onOpenAlloc();
  }

  function handleAlloc() {
    setAllocating(true);
    eventsService
      .allocate()
      .then((it) => {
        console.log(it.statusText);
        navigate('/allocation');
      })
      .catch(({ response }: AxiosError<ErrorResponse>) => {
        onCloseAlloc();
        onOpenDrawer();
        console.log(response?.data.error);
      })
      .finally(() => setAllocating(false));
  }

  function handleEditClick(obj: Class) {
    setSelectedClass(obj);
    onOpenEdit();
  }

  function handleEdit(data: EditClassEvents[]) {
    if (selectedClass) {
      classesService.edit(selectedClass.subject_code, selectedClass.class_code, data).then((it) => {
        console.log(it.data);
        fetchData();
      });
    }
  }

  function handleDrawerAlloc(data: HasToBeAllocatedClass[]) {
    setAllocating(true);
    classesService.editHasToBeAllocated(data).then(() => handleAlloc());
  }

  function handleCrawlerSave(subjectsList: string[]) {
    classesService
      .createMany(subjectsList)
      .then((it) => {
        console.log(it);
        fetchData();
      })
      .catch(({ response }: AxiosError<ErrorResponse>) =>
        toast({
          title: response?.data.message,
          position: 'top-left',
          status: 'error',
        }),
      );
  }

  return (
    <>
      <Navbar />
      <Loading isOpen={allocating} onClose={() => setAllocating(false)} />
      <PreferencesModal
        isOpen={isOpenPreferences}
        onClose={onClosePreferences}
        data={selectedClass}
        onSave={handleSavePreferences}
      />
      <EditModal isOpen={isOpenEdit} onClose={onCloseEdit} formData={selectedClass} onSave={handleEdit} />
      <HasToBeAllocatedDrawer
        isOpen={isOpenDrawer}
        onClose={onCloseDrawer}
        classesList={classesList}
        onSave={handleDrawerAlloc}
      />
      <Dialog
        isOpen={isOpenAlloc}
        onClose={onCloseAlloc}
        onConfirm={handleAlloc}
        title='Deseja calcular alocação para as turmas e salas cadastradas'
        warningText='ATENÇÃO: AO CONFIRMAR QUALQUER ALOCAÇÃO SALVA SERÁ PERDIDA'
      />

      <Center>
        <Box p={4} w='8xl' overflow='auto'>
          <Flex align='center'>
            <Text fontSize='4xl' mb={4}>
              Turmas
            </Text>
            <Spacer />
            <JupiterCrawlerPopover onSave={handleCrawlerSave} />
            <Button ml={2} colorScheme='blue' onClick={handleAllocClick}>
              Alocar
            </Button>
          </Flex>
          <Dialog
            isOpen={isOpenDelete}
            onClose={onCloseDelete}
            onConfirm={handleDelete}
            title={`Deseja deletar ${selectedClass?.subject_code} - ${selectedClass?.class_code}`}
          />
          <DataTable data={classesList} columns={columns} />
        </Box>
      </Center>
    </>
  );
}

export default Classes;
