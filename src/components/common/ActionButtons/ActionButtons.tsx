import {
  HStack,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';

import {
  BsBook,
  BsFillPenFill,
  BsFillTrashFill,
} from 'react-icons/bs';

interface Props {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewLabel?: string;
}

export default function ActionButtons({
  onView,
  onEdit,
  onDelete,
  viewLabel,
}: Props) {
  return (
    <HStack spacing="0px">
      {onView && (
        <Tooltip label={viewLabel ?? 'Visualizar'}>
          <IconButton
            colorScheme="blue"
            size="xs"
            variant="ghost"
            aria-label={viewLabel ?? 'visualizar'}
            icon={<BsBook />}
            onClick={onView}
          />
        </Tooltip>
      )}

      {onEdit && (
        <Tooltip label="Editar">
          <IconButton
            colorScheme="yellow"
            size="xs"
            variant="ghost"
            aria-label="editar"
            icon={<BsFillPenFill />}
            onClick={onEdit}
          />
        </Tooltip>
      )}

      {onDelete && (
        <Tooltip label="Remover">
          <IconButton
            colorScheme="red"
            size="xs"
            variant="ghost"
            aria-label="remover"
            icon={<BsFillTrashFill />}
            onClick={onDelete}
          />
        </Tooltip>
      )}
    </HStack>
  );
}