import {
  Box,
  Flex,
  Text,
  Button,
  Spacer,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  VStack,
  useMediaQuery,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuDivider,
  MenuItem,
} from '@chakra-ui/react';

import { AddIcon } from '@chakra-ui/icons';
import CurriculumCardList from './CurriculumCardList';

import {
  useEffect,
  useState,
} from 'react';

import {
  useLocation,
  useParams,
  useNavigate,
} from 'react-router-dom';

import PageContent from '../../components/common/PageContent';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';

import DataTable from '../../components/common/DataTable/dataTable.component';

import Dialog from '../../components/common/Dialog/dialog.component';

import useCurriculumsService, {
  MissingSubjectResponse,
} from '../../hooks/API/services/useCurriculumsService';

import useCoursesService from '../../hooks/API/services/useCoursesService';

import { CurriculumResponse } from '../../models/http/responses/curriculum.response.models';

import { CourseResponse } from '../../models/http/responses/course.response.models';

import { getCurriculumColumns } from './Tables/curriculum.table';

import { CreateCurriculumModal } from './CreateCurriculumModal/CreateCurriculumModal';

import { EditCurriculumModal } from './EditCurriculumModal/EditCurriculumModal';

import {
  LuHand,
  LuTimer,
} from 'react-icons/lu';

import CrawlerJupiterCurriculumModal from './CrawlerModal/crawler.jupiter.curriculum.modal';

import MissingSubjectsFloatingWindow from '../../components/common/FloatingWindow/floatingWindow.component';
import useCustomToast from '../../hooks/useCustomToast';

export default function Curriculums() {
  const { courseId } = useParams();

  const location = useLocation() as {
    pathname: string;
    state?: {
      course?: CourseResponse;
    };
  };

  const navigate = useNavigate();
  const showToast = useCustomToast();
  const [isResponsive] = useMediaQuery('(max-width: 1024px)');

  const { getAll, deleteById } =
    useCurriculumsService();

  const { getAll: getAllCourses } =
    useCoursesService();

  const [course, setCourse] =
    useState<CourseResponse | undefined>(
      location.state?.course,
    );

  const [curriculums, setCurriculums] =
    useState<CurriculumResponse[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [
    selectedCurriculum,
    setSelectedCurriculum,
  ] = useState<CurriculumResponse>();

  const [
    missingSubjects,
    setMissingSubjects,
  ] = useState<MissingSubjectResponse[]>(
    [],
  );

  const [
    showMissingWindow,
    setShowMissingWindow,
  ] = useState(false);

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

  const {
    isOpen: isOpenOptionsDrawer,
    onOpen: onOpenOptionsDrawer,
    onClose: onCloseOptionsDrawer,
  } = useDisclosure();

  async function fetchData() {
    setLoading(true);

    try {
      const [currRes, courseRes] =
        await Promise.all([
          getAll(),
          getAllCourses(),
        ]);

      const filtered =
        currRes.data.filter(
          (c) =>
            c.course_id ===
            Number(courseId),
        );

      setCurriculums(filtered);

      if (!course) {
        const found =
          courseRes.data.find(
            (c) =>
              c.id ===
              Number(courseId),
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

  function handleEditClick(
    curriculum: CurriculumResponse,
  ) {
    setSelectedCurriculum(
      curriculum,
    );

    onOpenEdit();
  }

  function handleDeleteClick(
    curriculum: CurriculumResponse,
  ) {
    setSelectedCurriculum(
      curriculum,
    );

    onOpenDelete();
  }

  function handleViewSubjects(
    curriculum: CurriculumResponse,
  ) {
    navigate(
      `/admin/courses/${courseId}/curriculums/${curriculum.id}/subjects`,
      {
        state: {
          curriculum,
          course,
          missingSubjects,
          showMissingWindow,
        },
      },
    );
  }

  async function handleDelete() {
    if (!selectedCurriculum) return;

    try {
      await deleteById(
        selectedCurriculum.id,
      );

      showToast(
        'Sucesso',
        'Currículo removido com sucesso.',
        'success',
      );

      onCloseDelete();

      refetch();
    } catch (err: unknown) {
      const error = err as any;

      console.error(
        'Erro ao remover currículo:',
        error,
      );

      showToast(
        'Erro',
        error?.response?.data?.detail ??
          'Não foi possível remover o currículo.',
        'error',
      );
    }
  }

  const columns =
    getCurriculumColumns({
      handleEditClick,
      handleDeleteClick,
      handleViewSubjects,
    });
  const optionsButtonBg = 'uspolis.blue';
  const optionsButtonColor = 'white';
  const renderOptionsMenu = () => (
    <Menu>
      <MenuButton
        as={Button}
        bg={optionsButtonBg}
        color={optionsButtonColor}
        _hover={{ opacity: 0.88 }}
        leftIcon={<AddIcon />}
        borderRadius="8px"
      >
        Opções
      </MenuButton>

      <MenuList
        w="300px"
        border="1px"
        bgColor="uspolis.white"
      >
        <MenuGroup
          title="Adição"
          fontSize="lg"
          gap="5px"
        >
          <MenuDivider />

          <MenuItem
            as={Button}
            bgColor="uspolis.white"
            justifyContent="flex-start"
            onClick={handleRegisterClick}
            leftIcon={<LuHand />}
            _hover={{
              textColor: 'uspolis.white',
            }}
          >
            Manual
          </MenuItem>

          <MenuDivider />

          <MenuItem
            as={Button}
            bgColor="uspolis.white"
            justifyContent="flex-start"
            leftIcon={<LuTimer />}
            onClick={onOpenCrawlerJupiterModal}
            _hover={{
              textColor: 'uspolis.white',
            }}
          >
            Júpiter
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
  const renderOptionsDrawerTrigger = () => (
    <Button
      bg={optionsButtonBg}
      color={optionsButtonColor}
      _hover={{ opacity: 0.88 }}
      leftIcon={<AddIcon />}
      borderRadius="8px"
      w="full"
      onClick={onOpenOptionsDrawer}
    >
      Opções
    </Button>
  );

  return (
    <PageContent horizontalScroll>
      <CreateCurriculumModal
        isOpen={isOpenCreate}
        onClose={onCloseCreate}
        courseId={Number(courseId)}
        refresh={refetch}
      />

      <EditCurriculumModal
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        curriculum={
          selectedCurriculum
        }
        refresh={refetch}
      />

      <CrawlerJupiterCurriculumModal
        isOpen={
          isOpenCrawlerJupiterModal
        }
        onClose={
          onCloseCrawlerJupiterModal
        }
        courseId={Number(courseId)}
        refetch={refetch}
        setMissingSubjects={
          setMissingSubjects
        }
        setShowMissingWindow={
          setShowMissingWindow
        }
      />

      <Dialog
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onConfirm={handleDelete}
        title={`Remover currículo?`}
        warningText='Essa ação é irreversível.'
      />

      <Drawer
        isOpen={isOpenOptionsDrawer}
        onClose={onCloseOptionsDrawer}
        placement="bottom"
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent
          h="80vh"
          maxH="80vh"
          bg="uspolis.white"
          borderTopRadius="16px"
          overflow="hidden"
        >
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Opções</DrawerHeader>
          <DrawerBody overflowY="auto" py={5}>
            <VStack align="stretch" spacing={3}>
              <Text fontWeight="semibold">Adição</Text>
              <Button
                variant="outline"
                bg="uspolis.white"
                color="uspolis.text"
                borderColor="uspolis.border"
                _hover={{ bg: 'uspolis.hover' }}
                justifyContent="flex-start"
                leftIcon={<LuHand />}
                onClick={() => {
                  onCloseOptionsDrawer();
                  handleRegisterClick();
                }}
              >
                Manual
              </Button>
              <Button
                variant="outline"
                bg="uspolis.white"
                color="uspolis.text"
                borderColor="uspolis.border"
                _hover={{ bg: 'uspolis.hover' }}
                justifyContent="flex-start"
                leftIcon={<LuTimer />}
                onClick={() => {
                  onCloseOptionsDrawer();
                  onOpenCrawlerJupiterModal();
                }}
              >
                Júpiter
              </Button>
            </VStack>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button colorScheme="blue" w="full" onClick={onCloseOptionsDrawer}>
              Fechar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Box w="100%" minW="344px">
        <Box display={{ base: 'block', md: 'none' }} mb={2}>
          <PageBreadcrumb
            pathname={location.pathname}
            color="uspolis.textMuted"
            wrap
          />
        </Box>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'stretch', md: 'center' }}
          gap={{ base: 3, md: 0 }}
          mb={4}
        >
          <Text
            fontSize={{ base: '2xl', md: '3xl' }}
          >
            Curso - {course?.name}
          </Text>

          <Spacer />

          <Box display={{ base: 'none', md: 'block' }}>
            {isResponsive
              ? renderOptionsDrawerTrigger()
              : renderOptionsMenu()}
          </Box>
        </Flex>

        {/* Desktop / notebook */}
        <Box
          display={{
            base: 'none',
            md: 'block',
          }}
          w="100%"
          overflowX="auto"
        >
          <DataTable
            loading={loading}
            data={curriculums}
            columns={columns}
            columnPinning={{
              left: ['description'],
              right: ['options'],
            }}
          />
        </Box>

        {/* Tablet / celular */}
        <Box
          display={{
            base: 'block',
            md: 'none',
          }}
          w="100%"
        >
          <CurriculumCardList
            curriculums={curriculums}
            loading={loading}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            handleViewSubjects={handleViewSubjects}
            toolbarAction={renderOptionsDrawerTrigger()}
          />
        </Box>
      </Box>

      {showMissingWindow &&
        missingSubjects.length >
          0 && (
          <MissingSubjectsFloatingWindow
            subjects={
              missingSubjects
            }
            onClose={() =>
              setShowMissingWindow(
                false,
              )
            }
          />
        )}
    </PageContent>
  );
}