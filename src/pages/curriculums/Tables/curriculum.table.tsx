import { ColumnDef } from '@tanstack/react-table';
import { CurriculumResponse } from '../../../models/http/responses/curriculum.response.models';
import ActionButtons from '../../../components/common/ActionButtons/ActionButtons';

interface Props {
  handleEditClick: (
    curriculum: CurriculumResponse,
  ) => void;

  handleDeleteClick: (
    curriculum: CurriculumResponse,
  ) => void;

  handleViewSubjects: (
    curriculum: CurriculumResponse,
  ) => void;
}

export function getCurriculumColumns({
  handleEditClick,
  handleDeleteClick,
  handleViewSubjects,
}: Props): ColumnDef<CurriculumResponse>[] {
  return [
    {
      accessorKey: 'description',
      header: 'Descrição',
    },
    {
      accessorKey: 'AAC',
      header: 'AAC',
    },
    {
      accessorKey: 'AEX',
      header: 'AEX',
    },
    {
      accessorKey: 'codcur',
      header: 'CODCUR',
    },
    {
      accessorKey: 'codhab',
      header: 'CODHAB',
    },
    {
      id: 'options',
      header: 'Opções',
      cell: ({ row }) => {
        const curriculum = row.original;

        return (
          <ActionButtons
            viewLabel="Ver Disciplinas"
            onView={() =>
              handleViewSubjects(curriculum)
            }
            onEdit={() =>
              handleEditClick(curriculum)
            }
            onDelete={() =>
              handleDeleteClick(curriculum)
            }
          />
        );
      },
    },
  ];
}