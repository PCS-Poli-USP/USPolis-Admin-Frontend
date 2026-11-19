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
  BsCalendarDateFill,
  BsFillPenFill,
  BsFillTrashFill,
} from 'react-icons/bs';
import { BiSolidCalendarEdit } from 'react-icons/bi';
import { CopyIcon } from '@chakra-ui/icons';

import CardList from '../../components/common/CardList/CardList';
import { CardFilter } from '../../components/common/CardList/CardFilters';
import { ClassResponse } from '../../models/http/responses/class.response.models';

interface Props {
  classes: ClassResponse[];
  loading: boolean;
  toolbarAction: ReactNode;
  onDuplicate: (item: ClassResponse) => void;
  onEdit: (item: ClassResponse) => void;
  onAllocationEdit: (item: ClassResponse) => void;
  onDelete: (item: ClassResponse) => void;
  onEditOccurrences: (item: ClassResponse) => void;
  disableMap: boolean[];
}

export default function ClassCardList({
  classes,
  loading,
  toolbarAction,
  onDuplicate,
  onEdit,
  onAllocationEdit,
  onDelete,
  onEditOccurrences,
  disableMap,
}: Props) {
  const filters: CardFilter<ClassResponse>[] = [
    {
      key: 'subject_code',
      label: 'Codigo da disciplina',
      type: 'text',
      placeholder: 'Buscar por codigo',
    },
    {
      key: 'subject_name',
      label: 'Disciplina',
      type: 'text',
      placeholder: 'Buscar por disciplina',
    },
    {
      key: 'code',
      label: 'Turma',
      type: 'text',
      placeholder: 'Buscar por turma',
    },
  ];

  return (
    <CardList
      items={classes}
      loading={loading}
      emptyMessage="Nenhuma turma cadastrada."
      filters={filters}
      columns={{ base: 1 }}
      toolbarAction={toolbarAction}
      renderCard={(item) => {
        const disabled = disableMap[classes.findIndex((cls) => cls.id === item.id)];
        return (
        <Flex
          key={item.id}
          bg="uspolis.white"
          border="1px solid"
          borderColor="uspolis.border"
          borderRadius="10px"
          overflow="hidden"
          w="100%"
        >
          <VStack align="stretch" spacing="10px" flex={1} minW={0} p="14px">
            <Flex justify="space-between" align="flex-start" gap={3}>
              <Heading size="md" color="uspolis.black" flex={1} minW={0}>
                {item.subject_name}
              </Heading>
              <Tag flex="none" borderRadius="20px" colorScheme="blue">
                Turma {item.code}
              </Tag>
            </Flex>

            <HStack spacing="12px" flexWrap="wrap">
              <Text fontSize="13px" color="uspolis.textMuted">
                {item.subject_code}
              </Text>
              <Text fontSize="13px" color="uspolis.textMuted">
                {item.vacancies} vagas
              </Text>
              <Text fontSize="13px" color="uspolis.textMuted">
                {item.professors.join(', ') || 'Sem professor'}
              </Text>
            </HStack>

            <Divider borderColor="uspolis.border" />
            <HStack spacing="6px" flexWrap="wrap" rowGap="6px">
              <Tag
                as="button"
                onClick={() => onEdit(item)}
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
                onClick={() => onDuplicate(item)}
                size="lg"
                variant="outline"
                colorScheme="blue"
                cursor="pointer"
                gap="6px"
              >
                <CopyIcon />
                Duplicar
              </Tag>
              <Tag
                as="button"
                onClick={() => onEditOccurrences(item)}
                size="lg"
                variant="outline"
                colorScheme="purple"
                cursor="pointer"
                gap="6px"
              >
                <BsCalendarDateFill size={11} />
                Horarios
              </Tag>
              {!disabled && (
                <Tag
                  as="button"
                  onClick={() => onAllocationEdit(item)}
                  size="lg"
                  variant="outline"
                  colorScheme="teal"
                  cursor="pointer"
                  gap="6px"
                >
                  <BiSolidCalendarEdit size={11} />
                  Alocar
                </Tag>
              )}
              {!disabled && (
                <Tag
                  as="button"
                  onClick={() => onDelete(item)}
                  size="lg"
                  variant="outline"
                  colorScheme="red"
                  cursor="pointer"
                  gap="6px"
                >
                  <BsFillTrashFill size={11} />
                  Excluir
                </Tag>
              )}
            </HStack>
          </VStack>
        </Flex>
        );
      }}
    />
  );
}
