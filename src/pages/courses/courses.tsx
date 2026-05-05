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

import PageContent from '../../components/common/PageContent';
import DataTable from '../../components/common/DataTable/dataTable.component';
import Dialog from '../../components/common/Dialog/dialog.component';

import useCoursesService from '../../hooks/API/services/useCoursesService';
import { CourseResponse } from '../../models/http/responses/course.response.models';

import { getCourseColumns } from './Tables/course.table';
import CourseModal from './CourseModal/course.modal';
import { useNavigate } from 'react-router-dom';

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
    } catch {
      console.error('Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  const navigate = useNavigate();

    function handleViewCurriculums(course: CourseResponse) {
    navigate(`/courses/${course.id}/curriculums`, {
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
    if (selectedCourse) {
      await deleteById(selectedCourse.id);
    }
    onCloseDelete();
    refetchCourses();
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

      <Box w="100%" overflowX="auto">
        <Flex align="center">
          <Text fontSize="4xl" mb={4}>
            Cursos
          </Text>

          <Spacer />

          <Button
            colorScheme="blue"
            rightIcon={<AddIcon />}
            onClick={handleCreateClick}
          >
            Cadastrar
          </Button>
        </Flex>

        <DataTable
          loading={loading}
          data={courses}
          columns={columns}
          columnPinning={{ left: ['name'], right: ['options'] }}
        />
      </Box>
    </PageContent>
  );
}

export default Courses;