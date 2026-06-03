import { ColumnDef } from '@tanstack/react-table';
import { IconButton, HStack, Tooltip } from '@chakra-ui/react';
import { CourseResponse } from '../../../models/http/responses/course.response.models';
import { BsBook, BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { getCoursePeriodLabel } from '../CourseModal/coursePeriodLabel';

interface Props {
  handleEditClick: (course: CourseResponse) => void;
  handleDeleteClick: (course: CourseResponse) => void;
  handleViewCurriculums: (course: CourseResponse) => void;
}

export function getCourseColumns({
  handleEditClick,
  handleDeleteClick,
  handleViewCurriculums,
}: Props): ColumnDef<CourseResponse>[] {
  const columns: ColumnDef<CourseResponse>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'ideal_duration',
      header: 'Ideal',
    },
    {
      accessorKey: 'minimal_duration',
      header: 'Mínima',
    },
    {
      accessorKey: 'maximal_duration',
      header: 'Máxima',
    },
    {
      accessorKey: 'period',
      header: 'Período',
      cell: ({ row }) => {
        return getCoursePeriodLabel(row.original.period);
      },
      },
      {
      id: 'options',
      header: 'Opções',
      cell: ({ row }) => {
        const course = row.original;

        return (
          <HStack spacing="0px">
            <Tooltip label="Ver Currículos">
              <IconButton
                colorScheme="blue"
                size="xs"
                variant="ghost"
                aria-label="ver-curriculos"
                icon={<BsBook />}
                onClick={() => handleViewCurriculums(course)}
              />
            </Tooltip>
            <Tooltip label="Editar">
              <IconButton
                colorScheme="yellow"
                size="xs"
                variant="ghost"
                aria-label="editar-curso"
                icon={<BsFillPenFill />}
                onClick={() => handleEditClick(course)}
              />
            </Tooltip>

            <Tooltip label="Remover">
              <IconButton
                colorScheme="red"
                size="xs"
                variant="ghost"
                aria-label="remover-curso"
                icon={<BsFillTrashFill />}
                onClick={() => handleDeleteClick(course)}
              />
            </Tooltip>
          </HStack>
        );
      },
    }
  ];

  return columns;
}