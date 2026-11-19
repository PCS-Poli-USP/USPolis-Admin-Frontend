import {
  Divider,
  Flex,
  Heading,
  HStack,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import moment from 'moment';

import CardList from '../../components/common/CardList/CardList';
import { CardFilter } from '../../components/common/CardList/CardFilters';
import { BuildingResponse } from '../../models/http/responses/building.response.models';

interface Props {
  buildings: BuildingResponse[];
  loading: boolean;
  onEdit: (building: BuildingResponse) => void;
  onDelete: (building: BuildingResponse) => void;
  toolbarAction: React.ReactNode;
}

export default function BuildingCardList({
  buildings,
  loading,
  onEdit,
  onDelete,
  toolbarAction,
}: Props) {
  const filters: CardFilter<BuildingResponse>[] = [
    {
      key: 'id',
      label: 'ID',
      type: 'text',
      placeholder: 'Buscar por ID',
      getValue: (building) => String(building.id),
    },
    {
      key: 'name',
      label: 'Nome',
      type: 'text',
      placeholder: 'Buscar por nome',
    },
    {
      key: 'created_by',
      label: 'Criado por',
      type: 'text',
      placeholder: 'Buscar por responsável',
    },
    {
      key: 'updated_at',
      label: 'Atualizado em',
      type: 'text',
      placeholder: 'Buscar por data de atualização',
      getValue: (building) =>
        `${moment(building.updated_at).format('DD/MM/YYYY [às] HH:mm')} ${building.updated_at}`,
      getSortValue: (building) => building.updated_at,
    },
  ];

  return (
    <CardList
      items={buildings}
      loading={loading}
      emptyMessage="Nenhum prédio cadastrado."
      filters={filters}
      columns={{ base: 1 }}
      toolbarAction={toolbarAction}
      renderCard={(building) => (
        <Flex
          key={building.id}
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
                {building.name}
              </Heading>
              <Tag flex="none" borderRadius="20px" colorScheme="blue">
              id {building.id}
              </Tag>
            </Flex>

            <Flex
              wrap="wrap"
              columnGap="18px"
              rowGap="6px"
              fontSize="13.5px"
              color="uspolis.textMuted"
            >
              <HStack spacing="7px">
                <Text fontWeight="medium" color="uspolis.text">
                  Criado por
                </Text>
                <Text overflowWrap="anywhere">{building.created_by}</Text>
              </HStack>
              <HStack spacing="7px">
                <Text fontWeight="medium" color="uspolis.text">
                  Atualizado em
                </Text>
                <Text>
                  {moment(building.updated_at).format('DD/MM/YYYY [às] HH:mm')}
                </Text>
              </HStack>
            </Flex>

            <Divider borderColor="uspolis.border" />

            <HStack spacing="6px" flexWrap="wrap" rowGap="6px">
              <Tag
                as="button"
                onClick={() => onEdit(building)}
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
                onClick={() => onDelete(building)}
                size="lg"
                variant="outline"
                colorScheme="red"
                cursor="pointer"
                gap="6px"
              >
                <BsFillTrashFill size={11} />
                Excluir
              </Tag>
            </HStack>
          </VStack>
        </Flex>
      )}
    />
  );
}
