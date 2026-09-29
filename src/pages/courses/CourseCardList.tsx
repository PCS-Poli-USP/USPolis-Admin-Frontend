import {
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';

import CardList from '../../components/common/CardList/CardList';
import {
  CardFilter,
} from '../../components/common/CardList/CardFilters';
import ActionButtons from '../../components/common/ActionButtons/ActionButtons';

import { CourseResponse } from '../../models/http/responses/course.response.models';
import { getCoursePeriodLabel } from './CourseModal/coursePeriodLabel';

interface Props {
  courses: CourseResponse[];
  loading: boolean;
  handleEditClick: (course: CourseResponse) => void;
  handleDeleteClick: (course: CourseResponse) => void;
  handleViewCurriculums: (course: CourseResponse) => void;
}

export default function CourseCardList({
  courses,
  loading,
  handleEditClick,
  handleDeleteClick,
  handleViewCurriculums,
}: Props) {
  const filters: CardFilter<CourseResponse>[] = [
    {
      key: 'name',
      label: 'Nome',
      type: 'text',
      placeholder: 'Buscar por nome',
    },
    {
      key: 'ideal_duration',
      label: 'Duração ideal',
      type: 'text',
      placeholder: 'Duração ideal',
    },
    {
      key: 'minimal_duration',
      label: 'Duração mínima',
      type: 'text',
      placeholder: 'Duração mínima',
    },
    {
      key: 'maximal_duration',
      label: 'Duração máxima',
      type: 'text',
      placeholder: 'Duração máxima',
    },
    {
      key: 'period',
      label: 'Período',
      type: 'select',
      options: Array.from(
        new Set(courses.map((course) => String(course.period))),
      ).map((period) => ({
        value: period,
        label: getCoursePeriodLabel(
          period as CourseResponse['period'],
        ),
      })),
      getValue: (course) => String(course.period),
    },
  ];

  return (
    <CardList
      items={courses}
      loading={loading}
      emptyMessage="Nenhum curso cadastrado."
      filters={filters}
      renderCard={(course) => (
        <Box
          key={course.id}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          w="100%"
        >
          <Flex
            justify="space-between"
            align="flex-start"
            gap={3}
          >
            <VStack
              align="start"
              spacing={1}
              flex={1}
            >
              <Heading size="md">
                {course.name}
              </Heading>

              <Text>
                <strong>Duração ideal:</strong>{' '}
                {course.ideal_duration}
              </Text>

              <Text>
                <strong>Duração mínima:</strong>{' '}
                {course.minimal_duration}
              </Text>

              <Text>
                <strong>Duração máxima:</strong>{' '}
                {course.maximal_duration}
              </Text>

              <Text>
                <strong>Período:</strong>{' '}
                {getCoursePeriodLabel(course.period)}
              </Text>
            </VStack>

            <ActionButtons
              viewLabel="Ver Currículos"
              onView={() => handleViewCurriculums(course)}
              onEdit={() => handleEditClick(course)}
              onDelete={() => handleDeleteClick(course)}
            />
          </Flex>

          <Divider mt={4} />
        </Box>
      )}
    />
  );
}