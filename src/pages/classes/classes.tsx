import {
  Box,
  Button,
  Center,
  Flex,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import { AxiosError } from 'axios';
import EditModal from 'components/classes/edit.modal';
import JupiterCrawlerPopover from 'components/classes/jupiterCrawler.popover';
import PreferencesModal from './ClassPreferencesModal/class.preferences.modal'
import RegisterModal from './ClassRegisterModal/class.register.modal';
import EditEventModal from 'components/allocation/editEvent.modal';
import DataTable from 'components/common/DataTable/dataTable.component';
import Dialog from 'components/common/Dialog/dialog.component';
import Loading from 'components/common/Loading/loading.component';
import Navbar from 'components/common/NavBar/navbar.component';
import { appContext } from 'context/AppContext';
import Class, {
  CreateClassEvents,
  Preferences,
  SClass,
} from 'models/common/class.model';
import { ErrorResponse } from 'models/interfaces/serverResponses';
import { useContext, useEffect, useState } from 'react';
import ClassesService from 'services/api/classes.service';
import BuildingsService from 'services/api/buildings.service';
import EventsService from 'services/api/events.service';
import {
  ClassToEventByClassroom,
  ClassToSClass,
  breakClassFormInEvents,
} from 'utils/classes/classes.formatter';
import { EventByClassrooms } from 'models/common/event.model';
import CrawlerService from 'services/api/crawler.service';
import { sortClasses } from 'utils/sorter';
import JupiterCrawlerModal from 'components/classes/jupiterCrawler.modal';
import MultipleEditModal from 'components/classes/multipleEdit.modal';
import { getClassesColumns } from './Tables/class.table';
import useCustomToast from 'hooks/useCustomToast';
import { Row } from '@tanstack/react-table';

function Classes() {
  const {
    isOpen: isOpenDeleteClass,
    onOpen: onOpenDeleteClass,
    onClose: onCloseDeleteClass,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteSelectedClasses,
    onOpen: onOpenDeleteSelectedClasses,
    onClose: onCloseDeleteSelectedClasses,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteAlloc,
    onOpen: onOpenDeleteAlloc,
    onClose: onCloseDeleteAlloc,
  } = useDisclosure();
  const {
    isOpen: isOpenPreferences,
    onOpen: onOpenPreferences,
    onClose: onClosePreferences,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenAllocEdit,
    onOpen: onOpenAllocEdit,
    onClose: onCloseAllocEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenRegister,
    onOpen: onOpenRegister,
    onClose: onCloseRegister,
  } = useDisclosure();
  const {
    isOpen: isOpenJupiterModal,
    onOpen: onOpenJupiterModal,
    onClose: onCloseJupiterModal,
  } = useDisclosure();
  const {
    isOpen: isOpenMultipleEdit,
    onOpen: onOpenMultipleEdit,
    onClose: onCloseMultipleEdit,
  } = useDisclosure();

  const [classesList, setClassesList] = useState<Array<SClass>>([]);
  const [buildingsList, setBuildingsList] = useState<Array<BuildingResponse>>(
    [],
  );
  const [selectedClassEventList, setSelectedClassEventList] = useState<
    Array<EventByClassrooms>
  >([]);
  const [selectedClass, setSelectedClass] = useState<Class>();
  const { setLoading } = useContext(appContext);
  const [allocating, setAllocating] = useState(false);
  const [successSubjects, setSuccessSubjects] = useState<string[]>([]);
  const [failedSubjects, setFailedSubjects] = useState<string[]>([]);
  const [checkMap, setCheckMap] = useState<boolean[]>([]);

  const showToast = useCustomToast();

  const classesService = new ClassesService();
  const buildingsService = new BuildingsService();
  const crawlerService = new CrawlerService();
  const eventsService = new EventsService();

  useEffect(() => {
    fetchData();
    fetchBuildings();
    // eslint-disable-next-line
  }, []);

  const columns = getClassesColumns({
    handleCheckAllClick,
    handleCheckboxClick,
    handleEditClick,
    handleAllocationEditClick,
    handlePreferencesClick,
    handleDeleteClassClick,
    handleDeleteAllocClick,
    checkMap,
  });


  function fetchBuildings() {
    buildingsService.list().then((it) => {
      setBuildingsList(it.data.sort(sortBuildingsResponse));
    });
  }

  function fetchData() {
    setLoading(true);
    classesService
      .list()
      .then((it) => {
        const classes = ClassToSClass(it.data.sort(sortClasses));
        setClassesList(classes);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        showToast('Erro!', `Erro ao carregar turmas: ${error.message}`, 'error');
      });
  }

  function handleRegisterClick() {
    onOpenRegister();
  }

  function handleRegister(data: Class) {
    const events: CreateClassEvents[] = breakClassFormInEvents(data);
    classesService
      .createOne(events)
      .then(() => {
        fetchData();
        showToast('Sucesso!', 'Turma criada com sucesso!', 'success');
      })
      .catch((error) => {
        showToast('Erro!', `Erro ao criar turma: ${error}`, 'error');
      });
  }

  function handleDeleteClassClick(obj: Class) {
    setSelectedClass(obj);
    onOpenDeleteClass();
  }

  function handleDeleteAllocClick(obj: Class) {
    setSelectedClass(obj);
    onOpenDeleteAlloc();
  }

  function handleDeleteClass() {
    if (selectedClass) {
      classesService
        .delete(selectedClass.subject_code, selectedClass.class_code)
        .then((it) => {
          onCloseDeleteClass();
          fetchData();
          showToast('Sucesso!', 'Turma deletada com sucesso!', 'success');
        })
        .catch((error) => {
          showToast('Erro!', `Erro ao deletar turma: ${error}`, 'error');
        });
    }
  }

  function handleDeleteAlloc() {
    if (selectedClass) {
      eventsService
        .deleteClassAllocation(
          selectedClass.subject_code,
          selectedClass.class_code,
        )
        .then((it) => {
          onCloseDeleteAlloc();
          fetchData();
          showToast('Sucesso!', 
            `Alocação de ${selectedClass.subject_code} - ${selectedClass.class_code}  deletada com sucesso!`, 'success'
          );
        })
        .catch((error) => {
          showToast('Erro!', 
            `Erro ao deletar alocação de ${selectedClass.subject_code} - ${selectedClass.class_code}: ${error}`, 'error'
          );
        });
    }
  }

  function handleAllocationEditClick(obj: Class) {
    setSelectedClass(obj);
    const events = ClassToEventByClassroom(obj, buildingsList);
    setSelectedClassEventList(events);
    onOpenAllocEdit();
  }

  function handleAllocationEdit(
    events_ids: string[],
    newClassroom: string,
    building_id: number,
  ) {
    eventsService
      .editManyAllocations({
        events_ids,
        classroom: newClassroom,
        building_id,
      })
      .then((it) => {
        showToast('Sucesso!', 'Alocação editada com sucesso!', 'success');
        fetchData();
        // refetch data
        // TODO: create AllocationContext
      })
      .catch((error) => {
        showToast('Erro!', `Erro ao editar alocação: ${error}`, 'error');
      });
  }

  function handleAllocationEditDelete(subjectCode: string, classCode: string) {
    eventsService
      .deleteClassAllocation(subjectCode, classCode)
      .then((it) => {
        showToast('Sucesso!', 
          `Alocação de ${subjectCode} - ${classCode}  deletada com sucesso!`, 'success'
        );
        fetchData();
      })
      .catch((error) => {
        showToast('Erro!', 
          `Erro ao deletar alocação de ${subjectCode} - ${classCode}: ${error}`, 'error'
        );
      });
  }

  function handlePreferencesClick(obj: Class) {
    setSelectedClass(obj);
    onOpenPreferences();
  }

  function handleSavePreferences(data: Preferences) {
    if (selectedClass) {
      classesService
        .patchPreferences(
          selectedClass.subject_code,
          selectedClass.class_code,
          data,
        )
        .then((it) => {
          fetchData();
          showToast('Sucesso!', 'Preferências editadas com sucesso!', 'success');
        })
        .catch((error) => {
          showToast('Erro!', `Erro ao editar preferências: ${error}`, 'error');
        });
    }
  }

  function handleEditClick(obj: Class) {
    setSelectedClass(obj);
    onOpenEdit();
  }

  function handleEdit(data: Class) {
    if (selectedClass) {
      const events = breakClassFormInEvents(data);
      classesService
        .edit(selectedClass.subject_code, selectedClass.class_code, events)
        .then((it) => {
          fetchData();
          showToast('Sucesso!', 'Turma editada com sucesso!', 'success');
        })
        .catch((error) => {
          showToast('Erro!', `Erro ao criar turma: ${error}`, 'error');
        });
    }
  }

  function handleCrawlerSave(subjectsList: string[], building_id: number) {
    setLoading(true);
    crawlerService
      .crawl({
        building_id,
        subject_codes_list: subjectsList,
      })
      .then((it) => {
        setSuccessSubjects(it.data.sucess);
        setFailedSubjects(it.data.failed);
        onOpenJupiterModal();
        fetchData();
        showToast('Sucesso!', 'Disciplinas foram carregadas com sucesso!', 'success');
      })
      .catch(({ response }: AxiosError<ErrorResponse>) =>
        showToast('Erro!', `Erro ao buscar disciplinas: ${response?.data.message}`, 'error'),
      )
      .finally(() => {
        setLoading(false);
      });
  }

  function handleDeleteSelectedClassesClick() {
    onOpenDeleteSelectedClasses();
  }

  function getSelectedEventsIds() {
    const events_ids: string[] = [];
    const checkedClasses = getCheckedClasses();
    checkedClasses.forEach((cl) => events_ids.push(...cl.events_ids));
    return events_ids;
  }

  function handleDeleteSelectedClasses() {
    const events_ids = getSelectedEventsIds();
    setLoading(true);
    eventsService
      .deleteManyEvents({ events_ids })
      .then((it) => {
        showToast('Sucesso!', 'Turmas removidas com sucesso!', 'success');
      })
      .catch((error) => {
        showToast('Erro!', `Erro ao remover turmas: ${error}`, 'error');
      })
      .finally(() => {
        fetchData();
        setLoading(false);
      });
    onCloseDeleteSelectedClasses();
  }

  function getCheckedClasses() {
    const checkedClasses: SClass[] = [];
    classesList.forEach((cl) => {
      if (cl.selected) checkedClasses.push(cl);
    });
    return checkedClasses;
  }

  function handleCheckAllClick(data: Row<SClass>[], value: boolean) {
    const newClasses: SClass[] = [];

    if (data.length !== classesList.length) {
      for (let cl of classesList) {
        const newCl = { ...cl };
        data.forEach((row) => {
          if (
            row.original.class_code === cl.class_code &&
            row.original.subject_code === cl.subject_code
          ) {
            newCl.selected = value;
          }
        });
        newClasses.push(newCl);
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        const newClass = { ...data[i].original, selected: value };
        newClasses.push(newClass);
      }
    }
    setClassesList(newClasses);
  }

  function handleCheckboxClick(
    subject_code: string,
    class_code: string,
    value: boolean,
  ) {
    const newClassesList = [];
    for (let cl of classesList) {
      if (cl.subject_code === subject_code && cl.class_code === class_code)
        cl.selected = value;
      newClassesList.push(cl);
    }
    setClassesList(newClassesList);
  }

  return (
    <>
      <Navbar />
      <Loading isOpen={allocating} onClose={() => setAllocating(false)} />
      <PreferencesModal
        isOpen={isOpenPreferences}
        onClose={onClosePreferences}
        data={selectedClass}
        buildings={buildingsList}
        onSave={handleSavePreferences}
      />
      <RegisterModal
        isOpen={isOpenRegister}
        onClose={onCloseRegister}
        onSave={handleRegister}
        buildings={buildingsList}
      />
      <EditModal
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        formData={selectedClass}
        onSave={handleEdit}
        buildings={buildingsList}
      />
      <EditEventModal
        isOpen={isOpenAllocEdit}
        onClose={onCloseAllocEdit}
        onSave={handleAllocationEdit}
        onDelete={handleAllocationEditDelete}
        classEvents={selectedClassEventList}
      />
      <JupiterCrawlerModal
        isOpen={isOpenJupiterModal}
        onClose={onCloseJupiterModal}
        successSubjects={successSubjects}
        failedSubjects={failedSubjects}
      />
      <MultipleEditModal
        isOpen={isOpenMultipleEdit}
        onClose={() => {
          onCloseMultipleEdit();
        }}
        classes={getCheckedClasses()}
        onRefresh={() => fetchData()}
      />

      <Center>
        <Box p={4} w={'100%'} overflow='auto'>
          <Flex align='center'>
            <Text fontSize='4xl' mb={4}>
              Turmas
            </Text>
            <Spacer />
            <Button mr={2} colorScheme={'blue'} onClick={handleRegisterClick}>
              Adicionar Turma
            </Button>
            <JupiterCrawlerPopover onSave={handleCrawlerSave} />
            <Button
              ml={2}
              colorScheme={'blue'}
              onClick={() => {
                onOpenMultipleEdit();
              }}
            >
              Editar selecionados
            </Button>
            <Button
              ml={2}
              colorScheme={'red'}
              onClick={handleDeleteSelectedClassesClick}
            >
              Remover selecioandos
            </Button>
          </Flex>
          <Dialog
            isOpen={isOpenDeleteClass}
            onClose={onCloseDeleteClass}
            onConfirm={handleDeleteClass}
            title={`Deseja remover ${selectedClass?.subject_code} - ${selectedClass?.class_code}`}
          />
          <Dialog
            isOpen={isOpenDeleteSelectedClasses}
            onClose={onCloseDeleteSelectedClasses}
            onConfirm={handleDeleteSelectedClasses}
            title={`Deseja remover todas as turmas selecionadas`}
            warningText='ATENÇÃO: QUALQUER TURMA SELECIONADA SERÁ PERDIDA!'
          />
          <Dialog
            isOpen={isOpenDeleteAlloc}
            onClose={onCloseDeleteAlloc}
            onConfirm={handleDeleteAlloc}
            title={`Deseja remover a alocação de ${selectedClass?.subject_code} - ${selectedClass?.class_code}`}
            warningText='Atenção: ao confirmar a alocação dessa turma será perdida'
          />
          <DataTable data={classesList} columns={columns} />
        </Box>
      </Center>
    </>
  );
}

export default Classes;
