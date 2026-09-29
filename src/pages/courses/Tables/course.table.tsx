import { ColumnDef } from '@tanstack/react-table';
import { CourseResponse } from '../../../models/http/responses/course.response.models';
import { getCoursePeriodLabel } from '../CourseModal/coursePeriodLabel';
import ActionButtons from '../../../components/common/ActionButtons/ActionButtons';

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
          <ActionButtons
            viewLabel="Ver Currículos"
            onView={() =>
              handleViewCurriculums(course)
            }
            onEdit={() =>
              handleEditClick(course)
            }
            onDelete={() =>
              handleDeleteClick(course)
            }
          />
        );
      },
    }
  ];

  return columns;
}