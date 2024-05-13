import Navbar from 'components/common/navbar.component';
import DataTable from 'components/common/dataTable.component';
import { ColumnDef } from '@tanstack/react-table';
import {
  CreateSubject,
  Subject,
  UpdateSubject,
} from 'models/database/subject.models';

import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { useContext, useEffect, useState } from 'react';
import SubjectRegisterModal from 'components/subjects/subjectRegister.modal';
import Dialog from 'components/common/dialog.component';
import { appContext } from 'context/AppContext';
import SubjectsService from 'services/subjects.service';
import { sortSubjects } from 'utils/subjects/subjects.sorter';
import {
  datetimeFormatter,
  typeFormatter,
} from 'utils/subjects/subjects.formatter';
import { SubjectsResponseCode } from 'models/enums/subjects.enum';

function Subjects() {
  const columns: ColumnDef<Subject>[] = [
    {
      accessorKey: 'code',
      header: 'Código',
    },
    {
      accessorKey: 'name',
      header: 'Nome',
      maxSize: 300,
    },
    {
      accessorKey: 'professors',
      header: 'Professores',
      cell: ({ row }) => (
        <Box>
          {row.original.professors?.map((professor, index) => (
            <Text
              maxW={425}
              overflowX={'hidden'}
              textOverflow={'ellipsis'}
              key={index}
            >
              {professor}
            </Text>
          ))}
        </Box>
      ),
    },
    {
      accessorFn: (row) => (row.buildings ? row.buildings : ['Não alocada']),
      header: 'Prédios',
      cell: ({ row }) => (
        <Box>
          {row.original.buildings ? (
            row.original.buildings.map((ref, index) => (
              <Text key={index}>{ref.id}</Text>
            ))
          ) : (
            <Text>Não alocada</Text>
          )}
        </Box>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Tipo',
      cell: ({ row }) => typeFormatter(row),
    },
    {
      accessorKey: 'class_credit',
      header: 'Créditos Aula',
    },
    {
      accessorKey: 'work_credit',
      header: 'Créditos Trabalho',
    },
    {
      header: 'Ativação / Desativação',
      cell: ({ row }) => datetimeFormatter(row),
    },
    {
      id: 'options',
      header: 'Opções',
      cell: ({ row }) => (
        <HStack spacing='0px'>
          <Tooltip label='Editar Disciplina'>
            <IconButton
              colorScheme='yellow'
              size='xs'
              variant='ghost'
              aria-label='editar-turma'
              icon={<BsFillPenFill />}
              onClick={() => handleEditSubjectButton(row.original)}
            />
          </Tooltip>

          <Tooltip label='Excluir Disciplina'>
            <IconButton
              colorScheme='red'
              size='xs'
              variant='ghost'
              aria-label='excluir-turma'
              icon={<BsFillTrashFill />}
              onClick={() => handleDeleteSubjectButton(row.original)}
            />
          </Tooltip>
        </HStack>
      ),
    },
  ];

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

  const { setLoading } = useContext(appContext);
  const subjectsService = new SubjectsService();

  const [subjects, setSubjects] = useState<Array<Subject>>([]);

  const [isUpdateSubject, setIsUpdateSubject] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>(
    undefined,
  );

  const toast = useToast();
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

  useEffect(() => {
    setLoading(true);
    fetchSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSubjects() {
    setLoading(true);
    await subjectsService
      .list()
      .then((response) => {
        setSubjects(response.data.sort(sortSubjects));
      })
      .catch((error) => {
        toastError(`Erro ao carregar disciplinas: ${error}`);
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleCreateSubjectButton() {
    setIsUpdateSubject(false);
    onOpenRegisterSubjectModal();
  }

  function handleEditSubjectButton(data: Subject) {
    setIsUpdateSubject(true);
    setSelectedSubject(data);
    onOpenRegisterSubjectModal();
  }

  function handleDeleteSubjectButton(data: Subject) {
    onOpenDeleteSubjectDialog();
    setSelectedSubject(data);
  }

  async function handleRegisterSubjectSave(
    data: CreateSubject | UpdateSubject,
  ) {
    if (isUpdateSubject && selectedSubject) {
      editSubject(selectedSubject?.id, data as UpdateSubject);
    } else {
      createSubject(data as CreateSubject);
    }
  }

  async function createSubject(data: CreateSubject) {
    await subjectsService
      .create(data)
      .then((response) => {
        toastSuccess(`Disciplina ${data.code} criada com sucesso!`);
        console.log(response);
      })
      .catch((error) => {
        const status = error.response.status;
        if (status === SubjectsResponseCode.ALREADY_EXISTS) {
          toastError(`Disciplina ${data.code} já existe!`);
        }
        if (status === SubjectsResponseCode.NOT_FOUND) {
          toastError(`Disciplina ${data.code} não encontrada`);
        } else {
          toastError(`Erro ao criar disciplina ${data.code}`);
        }
      })
      .finally(() => {
        fetchSubjects();
      });
  }

  async function editSubject(id: string, data: UpdateSubject) {
    await subjectsService
      .update(id, data)
      .then((response) => {
        toastSuccess(`Disciplina ${data.code} atualizada com sucesso!`);
      })
      .catch((error) => {
        const status = error.response.status;
        if (status === SubjectsResponseCode.ALREADY_EXISTS) {
          toastError(`Disciplina ${data.code} já existe!`);
        }
        if (status === SubjectsResponseCode.METHOD_NOT_ALLOWED) {
          toastError(
            `Erro ao editar disciplina ${data.code}, método não autorizado`,
          );
        } else {
          toastError(`Erro ao editar disciplina: ${error}`);
        }
        console.log(error);
      })
      .finally(() => {
        fetchSubjects();
      });
  }

  async function handleDeleteSubject() {
    onCloseDeleteSubjectDialog();
    if (selectedSubject) {
      await subjectsService
        .delete(selectedSubject.id)
        .then((response) => {
          toastSuccess(`Disciplina excluída!`);
        })
        .catch((error) => {
          const status = error.response.status;
          if (status === SubjectsResponseCode.NOT_FOUND) {
            toastError(`Disciplina não encontrada`);
          }
          if (status === 500) {
            toastError('Erro do server ao excluir disciplina');
          } else {
            toastError(`Erro ao excluir disciplina: ${error}`);
          }
        })
        .finally(() => {
          fetchSubjects();
        });
    }
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
        <SubjectRegisterModal
          isOpen={isOpenRegisterSubjectModal}
          onClose={() => {
            setSelectedSubject(undefined);
            onCloseRegisterSubjectModal();
          }}
          onSave={handleRegisterSubjectSave}
          formData={selectedSubject ? selectedSubject : undefined}
          isUpdate={isUpdateSubject}
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
          onConfirm={handleDeleteSubject}
        />
      </Flex>
    </>
  );
}

export default Subjects;
