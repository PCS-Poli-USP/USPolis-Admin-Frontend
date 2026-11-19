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
import { CopyIcon } from '@chakra-ui/icons';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';

import CardList from '../../components/common/CardList/CardList';
import { CardFilter } from '../../components/common/CardList/CardFilters';
import { SubjectResponse } from '../../models/http/responses/subject.response.models';
import { SubjectType } from '../../utils/enums/subjects.enum';

interface Props {
  subjects: SubjectResponse[];
  loading: boolean;
  onEdit: (subject: SubjectResponse) => void;
  onDelete: (subject: SubjectResponse) => void;
  onDuplicate: (subject: SubjectResponse) => void;
  disableMap: boolean[];
  toolbarAction: ReactNode;
}

export default function SubjectCardList({
  subjects,
  loading,
  onEdit,
  onDelete,
  onDuplicate,
  disableMap,
  toolbarAction,
}: Props) {
  const filters: CardFilter<SubjectResponse>[] = [
    { key: 'code', label: 'Código', type: 'text', placeholder: 'Buscar por código' },
    { key: 'name', label: 'Nome', type: 'text', placeholder: 'Buscar por nome' },
    {
      key: 'professors',
      label: 'Professores',
      type: 'text',
      placeholder: 'Buscar por professor',
      getValue: (subject) => subject.professors?.join(', ') ?? '',
    },
    {
      key: 'buildings',
      label: 'Prédios',
      type: 'text',
      placeholder: 'Buscar por prédio',
      getValue: (subject) => subject.buildings?.map((building) => building.name).join(', ') ?? 'Não alocada',
    },
    {
      key: 'type',
      label: 'Tipo',
      type: 'select',
      options: SubjectType.values().map((type) => ({
        value: type,
        label: SubjectType.translate(type),
      })),
    },
  ];

  return (
    <CardList
      items={subjects}
      loading={loading}
      emptyMessage="Nenhuma disciplina cadastrada."
      filters={filters}
      columns={{ base: 1 }}
      toolbarAction={toolbarAction}
      renderCard={(subject) => {
        const isDisabled = disableMap[subjects.findIndex((item) => item.id === subject.id)] ?? false;
        return (
        <Flex
          key={subject.id}
          bg="uspolis.white"
          border="1px solid"
          borderColor="uspolis.border"
          borderRadius="10px"
          overflow="hidden"
          w="100%"
        >
          <VStack align="stretch" spacing="12px" flex={1} minW={0} p="14px">
            <Flex align="flex-start" justify="space-between" gap={3} wrap="wrap">
              <Heading size="md" color="uspolis.black" flex={1} minW={0} overflowWrap="anywhere">
                {subject.name}
              </Heading>
              <Tag flex="none" borderRadius="20px" colorScheme="blue">
                {subject.code}
              </Tag>
            </Flex>

            <Flex wrap="wrap" columnGap="18px" rowGap="6px" fontSize="13.5px" color="uspolis.textMuted">
              <HStack spacing="7px">
                <Text fontWeight="medium" color="uspolis.text">Tipo</Text>
                <Text>{SubjectType.translate(subject.type)}</Text>
              </HStack>
              <HStack spacing="7px">
                <Text fontWeight="medium" color="uspolis.text">Créditos</Text>
                <Text>{subject.class_credit} aula / {subject.work_credit} trabalho</Text>
              </HStack>
              {subject.professors?.length > 0 && (
                <HStack spacing="7px" align="flex-start">
                  <Text fontWeight="medium" color="uspolis.text">Professores</Text>
                  <Text overflowWrap="anywhere">{subject.professors.join(', ')}</Text>
                </HStack>
              )}
              <HStack spacing="7px" align="flex-start">
                <Text fontWeight="medium" color="uspolis.text">Prédios</Text>
                <Text overflowWrap="anywhere">
                  {subject.buildings?.length
                    ? subject.buildings.map((building) => building.name).join(', ')
                    : 'Não alocada'}
                </Text>
              </HStack>
            </Flex>

            <Divider borderColor="uspolis.border" />

            <HStack spacing="6px" flexWrap="wrap" rowGap="6px">
              <Tag as="button" onClick={() => onDuplicate(subject)} size="lg" variant="outline" colorScheme="cyan" cursor="pointer" gap="6px">
                <CopyIcon boxSize="11px" /> Duplicar
              </Tag>
              <Tag
                as="button"
                onClick={() => !isDisabled && onEdit(subject)}
                size="lg"
                variant="outline"
                colorScheme="yellow"
                cursor={isDisabled ? 'not-allowed' : 'pointer'}
                opacity={isDisabled ? 0.5 : 1}
                gap="6px"
              >
                <BsFillPenFill size={11} /> Editar
              </Tag>
              <Tag
                as="button"
                onClick={() => !isDisabled && onDelete(subject)}
                size="lg"
                variant="outline"
                colorScheme="red"
                cursor={isDisabled ? 'not-allowed' : 'pointer'}
                opacity={isDisabled ? 0.5 : 1}
                gap="6px"
              >
                <BsFillTrashFill size={11} /> Excluir
              </Tag>
            </HStack>
          </VStack>
        </Flex>
        );
      }}
    />
  );
}
