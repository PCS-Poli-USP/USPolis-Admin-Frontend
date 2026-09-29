import {
  Box,
  Button,
  Flex,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import CourseCardList from './CourseCardList';

import PageContent from '../../components/common/PageContent';
import DataTable from '../../components/common/DataTable/dataTable.component';
import Dialog from '../../components/common/Dialog/dialog.component';

import useCoursesService from '../../hooks/API/services/useCoursesService';
import { CourseResponse } from '../../models/http/responses/course.response.models';

import { getCourseColumns } from './Tables/course.table';
import CourseModal from './CourseModal/course.modal';
import { useNavigate } from 'react-router-dom';
import useCustomToast from '../../hooks/useCustomToast';

function Courses() {
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const [selectedCourse, setSelectedCourse] =
    useState<CourseResponse>();

  const [isUpdate, setIsUpdate] = useState(false);

  const { getAll, deleteById } = useCoursesService();

  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchCourses() {
    setLoading(true);

    try {
      const res = await getAll();
      setCourses(res.data);
    } catch (error) {
      console.error(
        'Erro ao carregar cursos:',
        error,
      );

      showToast(
        'Erro',
        'Não foi possível carregar os cursos.',
        'error',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();
  const showToast = useCustomToast();

    function handleViewCurriculums(course: CourseResponse) {
    navigate(`/admin/courses/${course.id}/curriculums`, {
        state: { course },
    });
    }

  function refetchCourses() {
    fetchCourses();
  }

  function handleCreateClick() {
    setSelectedCourse(undefined);
    setIsUpdate(false);
    onOpenModal();
  }

  function handleEditClick(course: CourseResponse) {
    setSelectedCourse(course);
    setIsUpdate(true);
    onOpenModal();
  }

  function handleDeleteClick(course: CourseResponse) {
    setSelectedCourse(course);
    onOpenDelete();
  }

  async function handleDelete() {
    if (!selectedCourse) return;

    try {
      await deleteById(selectedCourse.id);

      showToast(
        'Sucesso',
        'Curso removido com sucesso.',
        'success',
      );

      onCloseDelete();

      refetchCourses();
    } catch (error) {
      console.error(
        'Erro ao remover curso:',
        error,
      );

      showToast(
        'Erro',
        'Não foi possível remover o curso.',
        'error',
      );
    }
  }

    const columns = getCourseColumns({
        handleEditClick,
        handleDeleteClick,
        handleViewCurriculums,
    });

  return (
    <PageContent>
      <CourseModal
        isOpen={isOpenModal}
        onClose={() => {
          onCloseModal();
          setSelectedCourse(undefined);
          setIsUpdate(false);
        }}
        isUpdate={isUpdate}
        selectedCourse={selectedCourse}
        refetch={refetchCourses}
      />

      <Dialog
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onConfirm={handleDelete}
        title={`Deseja remover ${selectedCourse?.name}?`}
        warningText="Essa ação é irreversível."
      />

      <Box w="100%">
  <Flex
    direction={{ base: 'column', lg: 'row' }}
    align={{ base: 'stretch', lg: 'center' }}
    gap={{ base: 3, lg: 0 }}
    mb={4}
  >
    <Text fontSize={{ base: '2xl', lg: '4xl' }}>
      Cursos
    </Text>

    <Spacer />

    <Button
      colorScheme="blue"
      rightIcon={<AddIcon />}
      onClick={handleCreateClick}
      w={{ base: '100%', lg: 'auto' }}
    >
      Cadastrar
    </Button>
  </Flex>

    <Box
      display={{ base: 'none', lg: 'block' }}
      w="100%"
      overflowX="auto"
    >
      <DataTable
        loading={loading}
        data={courses}
        columns={columns}
        columnPinning={{
          left: ['name'],
          right: ['options'],
        }}
      />
    </Box>
    <Box
      display={{ base: 'block', lg: 'none' }}
      w="100%"
    >
      <CourseCardList
        courses={courses}
        loading={loading}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        handleViewCurriculums={handleViewCurriculums}
      />
    </Box>
  </Box>
    </PageContent>
  );
}

export default Courses;