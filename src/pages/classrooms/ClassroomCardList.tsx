import {
  Divider,
  Flex,
  Heading,
  HStack,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import moment from 'moment';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';

import CardList from '../../components/common/CardList/CardList';
import { CardFilter } from '../../components/common/CardList/CardFilters';
import { ClassroomResponse } from '../../models/http/responses/classroom.response.models';
import { AudiovisualType } from '../../utils/enums/audiovisualType.enum';

interface Props {
  classrooms: ClassroomResponse[];
  loading: boolean;
  onDuplicate: (classroom: ClassroomResponse) => void;
  onEdit: (classroom: ClassroomResponse) => void;
  onDelete: (classroom: ClassroomResponse) => void;
  toolbarAction: React.ReactNode;
}

const booleanOptions = [
  { value: 'true', label: 'Sim' },
  { value: 'false', label: 'Não' },
];

export default function ClassroomCardList({
  classrooms,
  loading,
  onDuplicate,
  onEdit,
  onDelete,
  toolbarAction,
}: Props) {
  const filters: CardFilter<ClassroomResponse>[] = [
    {
      key: 'name',
      label: 'Nome',
      type: 'text',
      placeholder: 'Buscar por nome',
    },
    {
      key: 'building',
      label: 'Prédio',
      type: 'select',
      options: Array.from(new Set(classrooms.map(({ building }) => building)))
        .sort()
        .map((building) => ({ value: building, label: building })),
    },
    {
      key: 'floor',
      label: 'Andar',
      type: 'text',
      placeholder: 'Buscar por andar',
      getValue: (classroom) => String(classroom.floor),
    },
    {
      key: 'capacity',
      label: 'Capacidade',
      type: 'text',
      placeholder: 'Buscar por capacidade',
      getValue: (classroom) => String(classroom.capacity),
    },
    {
      key: 'air_conditioning',
      label: 'Ar-condicionado',
      type: 'select',
      options: booleanOptions,
      getValue: (classroom) => String(classroom.air_conditioning),
    },
    {
      key: 'audiovisual',
      label: 'Audiovisual',
      type: 'select',
      options: AudiovisualType.values().map((value) => ({
        value,
        label: AudiovisualType.translate(value),
      })),
      getValue: (classroom) => classroom.audiovisual,
    },
    {
      key: 'accessibility',
      label: 'Acessibilidade',
      type: 'select',
      options: booleanOptions,
      getValue: (classroom) => String(classroom.accessibility),
    },
    {
      key: 'reservable',
      label: 'Reservável',
      type: 'select',
      options: booleanOptions,
      getValue: (classroom) => String(classroom.reservable),
    },
    {
      key: 'restricted',
      label: 'Restrito',
      type: 'select',
      options: booleanOptions,
      getValue: (classroom) => String(classroom.restricted),
    },
    {
      key: 'updated_at',
      label: 'Atualizado em',
      type: 'text',
      placeholder: 'Buscar por data de atualização',
      getValue: (classroom) =>
        moment(classroom.updated_at).format('DD/MM/YYYY [às] HH:mm'),
      getSortValue: (classroom) => classroom.updated_at,
    },
  ];

  return (
    <CardList
      items={classrooms}
      loading={loading}
      emptyMessage="Nenhuma sala de aula cadastrada."
      filters={filters}
      columns={{ base: 1 }}
      toolbarAction={toolbarAction}
      renderCard={(classroom) => (
        <Flex
          key={classroom.id}
          bg="uspolis.white"
          border="1px solid"
          borderColor="uspolis.border"
          borderRadius="10px"
          overflow="hidden"
          w="100%"
        >
          <VStack align="stretch" spacing="12px" flex={1} minW={0} p="14px">
            <Flex justify="space-between" align="flex-start" gap={3}>
              <Heading
                size="md"
                color="uspolis.black"
                flex={1}
                minW={0}
                overflowWrap="anywhere"
              >
                {classroom.name}
              </Heading>
              <Tag flex="none" borderRadius="20px" colorScheme="blue">
                {classroom.building}
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
                { label: 'Andar', value: classroom.floor },
                { label: 'Capacidade', value: classroom.capacity },
                {
                  label: 'Audiovisual',
                  value: AudiovisualType.translate(classroom.audiovisual),
                },
                {
                  label: 'Atualizado em',
                  value: moment(classroom.updated_at).format(
                    'DD/MM/YYYY [às] HH:mm',
                  ),
                },
              ].map(({ label, value }) => (
                <HStack key={label} spacing="7px">
                  <Text fontWeight="medium" color="uspolis.text">
                    {label}
                  </Text>
                  <Text>{value}</Text>
                </HStack>
              ))}
            </Flex>

            {classroom.observation && (
              <Text fontSize="sm" color="uspolis.textMuted" overflowWrap="anywhere">
                {classroom.observation}
              </Text>
            )}

            <Flex
              wrap="wrap"
              columnGap="18px"
              rowGap="6px"
              fontSize="13.5px"
              color="uspolis.textMuted"
            >
              {[
                { label: 'Ar-condicionado', enabled: classroom.air_conditioning },
                { label: 'Acessível', enabled: classroom.accessibility },
                { label: 'Reservável', enabled: classroom.reservable },
                { label: 'Restrito', enabled: classroom.restricted },
              ].map(({ label, enabled }) => (
                <HStack key={label} spacing="7px">
                  <Text fontWeight="medium" color="uspolis.text">
                    {label}
                  </Text>
                  <Text>{enabled ? 'Sim' : 'Não'}</Text>
                </HStack>
              ))}
            </Flex>

            <Divider borderColor="uspolis.border" />

            <HStack spacing="6px" flexWrap="wrap" rowGap="6px">
              <Tag
                as="button"
                onClick={() => onDuplicate(classroom)}
                size="lg"
                variant="outline"
                colorScheme="blue"
                cursor="pointer"
                gap="6px"
              >
                <CopyIcon boxSize="11px" />
                Duplicar
              </Tag>
              <Tag
                as="button"
                onClick={() => onEdit(classroom)}
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
                onClick={() => onDelete(classroom)}
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
