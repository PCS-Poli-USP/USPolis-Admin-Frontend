import {
  Divider,
  Flex,
  Heading,
  HStack,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import {
  BsBook,
  BsFillPenFill,
  BsFillTrashFill,
} from 'react-icons/bs';

import CardList from '../../components/common/CardList/CardList';
import {
  CardFilter,
} from '../../components/common/CardList/CardFilters';

import { CourseResponse } from '../../models/http/responses/course.response.models';
import { getCoursePeriodLabel } from './CourseModal/coursePeriodLabel';

interface Props {
  courses: CourseResponse[];
  loading: boolean;
  handleEditClick: (course: CourseResponse) => void;
  handleDeleteClick: (course: CourseResponse) => void;
  handleViewCurriculums: (course: CourseResponse) => void;
  toolbarAction: ReactNode;
}

export default function CourseCardList({
  courses,
  loading,
  handleEditClick,
  handleDeleteClick,
  handleViewCurriculums,
  toolbarAction,
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
      columns={{ base: 1 }}
      toolbarAction={toolbarAction}
      renderCard={(course) => (
        <Flex
          key={course.id}
          bg="uspolis.white"
          border="1px solid"
          borderColor="uspolis.border"
          borderRadius="10px"
          overflow="hidden"
          w="100%"
        >
          <VStack align="stretch" spacing="12px" flex={1} minW={0} p="14px">
            <Flex
              align="flex-start"
              justify="space-between"
              gap={3}
              wrap="wrap"
            >
              <Heading
                size="md"
                color="uspolis.black"
                flex={1}
                minW={0}
                overflowWrap="anywhere"
              >
                {course.name}
              </Heading>
              <Tag
                flex="none"
                borderRadius="20px"
                colorScheme="blue"
                fontSize="12.5px"
                fontWeight="bold"
              >
                {getCoursePeriodLabel(course.period)}
              </Tag>
            </Flex>

            <Flex
              wrap="wrap"
              columnGap="18px"
              rowGap="6px"
              fontSize="13.5px"
              color="uspolis.textMuted"
            >
              {[
                { label: 'Duração ideal', value: course.ideal_duration },
                { label: 'Duração mínima', value: course.minimal_duration },
                { label: 'Duração máxima', value: course.maximal_duration },
              ].map(({ label, value }) => (
                <HStack
                  key={label}
                  spacing="7px"
                >
                  <Text fontWeight="medium" color="uspolis.text">
                    {label}
                  </Text>
                  <Text>{value}</Text>
                </HStack>
              ))}
            </Flex>

            <Divider borderColor="uspolis.border" />

            <HStack
              spacing="6px"
              flexWrap="wrap"
              rowGap="6px"
              onClick={(event) => event.stopPropagation()}
            >
              <Tag
                as="button"
                onClick={() => handleViewCurriculums(course)}
                size="lg"
                variant="outline"
                colorScheme="blue"
                cursor="pointer"
                gap="6px"
              >
                <BsBook size={12} />
                Ver currículos
              </Tag>
              <Tag
                as="button"
                onClick={() => handleEditClick(course)}
                size="lg"
                variant="outline"
                colorScheme="yellow"
                cursor="pointer"
                gap="6px"
              >
                <BsFillPenFill size={11} />
                Editar
              </Tag>
              <Tag
                as="button"
                onClick={() => handleDeleteClick(course)}
                size="lg"
                variant="outline"
                colorScheme="red"
                cursor="pointer"
                gap="6px"
              >
                <BsFillTrashFill size={11} />
                Remover
              </Tag>
            </HStack>
          </VStack>
        </Flex>
      )}
    />
  );
}