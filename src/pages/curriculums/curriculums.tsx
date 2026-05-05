import {
  Box,
  Flex,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Spacer,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuDivider,
  MenuItem,
} from '@chakra-ui/react';

import { AddIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

import PageContent from '../../components/common/PageContent';
import DataTable from '../../components/common/DataTable/dataTable.component';
import Dialog from '../../components/common/Dialog/dialog.component';

import useCurriculumsService from '../../hooks/API/services/useCurriculumsService';
import useCoursesService from '../../hooks/API/services/useCoursesService';

import { CurriculumResponse } from '../../models/http/responses/curriculum.response.models';
import { CourseResponse } from '../../models/http/responses/course.response.models';

import { getCurriculumColumns } from './Tables/curriculum.table';
import { CreateCurriculumModal } from './CreateCurriculumModal/CreateCurriculumModal';
import { EditCurriculumModal } from './EditCurriculumModal/EditCurriculumModal';

import { LuHand, LuTimer } from 'react-icons/lu';

import CrawlerJupiterCurriculumModal from './CrawlerModal/crawler.jupiter.curriculum.modal';

export default function Curriculums() {
  const { courseId } = useParams();
  const location = useLocation() as {
    state?: { course?: CourseResponse };
  };
  const navigate = useNavigate();

  const { getAll, deleteById } = useCurriculumsService();
  const { getAll: getAllCourses } = useCoursesService();

  const [course, setCourse] = useState<CourseResponse | undefined>(
    location.state?.course
  );

  const [curriculums, setCurriculums] = useState<CurriculumResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedCurriculum, setSelectedCurriculum] =
    useState<CurriculumResponse>();

  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const {
    isOpen: isOpenCrawlerJupiterModal,
    onOpen: onOpenCrawlerJupiterModal,
    onClose: onCloseCrawlerJupiterModal,
  } = useDisclosure();

  async function fetchData() {
    setLoading(true);
    try {
      const [currRes, courseRes] = await Promise.all([
        getAll(),
        getAllCourses(),
      ]);

      const filtered = currRes.data.filter(
        (c) => c.course_id === Number(courseId)
      );

      setCurriculums(filtered);

      if (!course) {
        const found = courseRes.data.find(
          (c) => c.id === Number(courseId)
        );
        setCourse(found);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [courseId]);

  function refetch() {
    fetchData();
  }

  function handleRegisterClick() {
    onOpenCreate();
  }

  function handleEditClick(curriculum: CurriculumResponse) {
    setSelectedCurriculum(curriculum);
    onOpenEdit();
  }

  function handleDeleteClick(curriculum: CurriculumResponse) {
    setSelectedCurriculum(curriculum);
    onOpenDelete();
  }

  function handleViewSubjects(curriculum: CurriculumResponse) {
    navigate(`/curriculums/${curriculum.id}/subjects`, {
      state: {
        curriculum,
        course,
      },
    });
  }

  async function handleDelete() {
    if (selectedCurriculum) {
      await deleteById(selectedCurriculum.id);
    }
    onCloseDelete();
    refetch();
  }

  async function handleCrawlerSaved() {
    onCloseCrawlerJupiterModal();
    refetch();
  }

  const columns = getCurriculumColumns({
    handleEditClick,
    handleDeleteClick,
    handleViewSubjects,
  });

  return (
    <PageContent>
      <Breadcrumb mb={4}>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate('/courses')}>
            Cursos
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>
            {course?.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <CreateCurriculumModal
        isOpen={isOpenCreate}
        onClose={onCloseCreate}
        courseId={Number(courseId)}
        refresh={refetch}
      />

      <EditCurriculumModal
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        curriculum={selectedCurriculum}
        refresh={refetch}
      />

      <CrawlerJupiterCurriculumModal
        isOpen={isOpenCrawlerJupiterModal}
        onClose={onCloseCrawlerJupiterModal}
        courseId={Number(courseId)}
        onSaved={handleCrawlerSaved}
      />

      <Dialog
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onConfirm={handleDelete}
        title={`Remover currículo?`}
        warningText="Essa ação é irreversível."
      />

      <Box>
        <Flex align="center" mb={4}>
          <Text fontSize="3xl">
            {course?.name}
          </Text>

          <Spacer />

          <Menu>
            <MenuButton
              as={Button}
              colorScheme="blue"
              leftIcon={<AddIcon />}
              borderRadius={'20px'}
            >
              Opções
            </MenuButton>

            <MenuList w={'300px'} border={'1px'} bgColor={'uspolis.white'}>
              <MenuGroup title="Adição" fontSize={'lg'} gap={'5px'}>
                <MenuDivider />

                <MenuItem
                  as={Button}
                  bgColor={'uspolis.white'}
                  justifyContent={'flex-start'}
                  onClick={handleRegisterClick}
                  leftIcon={<LuHand />}
                  _hover={{ textColor: 'uspolis.white' }}
                >
                  Manual
                </MenuItem>

                <MenuDivider />

                <MenuItem
                  as={Button}
                  bgColor={'uspolis.white'}
                  justifyContent={'flex-start'}
                  leftIcon={<LuTimer />}
                  onClick={onOpenCrawlerJupiterModal}
                  _hover={{ textColor: 'uspolis.white' }}
                >
                  Júpiter
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </Flex>

        <DataTable
          loading={loading}
          data={curriculums}
          columns={columns}
          columnPinning={{ left: ['name'], right: ['options'] }}
        />
      </Box>
    </PageContent>
  );
}