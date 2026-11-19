import {
  Divider,
  Flex,
  Heading,
  HStack,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import moment from 'moment';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';

import CardList from '../../components/common/CardList/CardList';
import { CardFilter } from '../../components/common/CardList/CardFilters';
import { InstitutionalEventResponse } from '../../models/http/responses/instituionalEvent.response.models';
import { EventType } from '../../utils/enums/eventTypes.enum';
import { periodFormatter } from '../../utils/institutionalEvents/institutionalEvents.formatter';

const translateCategory = (category: string) => {
  const eventType = EventType.values().find((value) => value === category);
  return eventType ? EventType.translate(eventType) : category;
};

interface Props {
  events: InstitutionalEventResponse[];
  loading: boolean;
  onEdit: (event: InstitutionalEventResponse) => void;
  onDelete: (event: InstitutionalEventResponse) => void;
  toolbarAction?: React.ReactNode;
}

export default function InstitutionalEventCardList({
  events,
  loading,
  onEdit,
  onDelete,
  toolbarAction,
}: Props) {
  const filters: CardFilter<InstitutionalEventResponse>[] = [
    {
      key: 'title',
      label: 'Titulo',
      type: 'text',
      placeholder: 'Buscar por titulo',
    },
    {
      key: 'category',
      label: 'Categoria',
      type: 'text',
      placeholder: 'Buscar por categoria',
    },
    {
      key: 'location',
      label: 'Local',
      type: 'text',
      placeholder: 'Buscar por local',
      getValue: (event) =>
        event.building
          ? `${event.building} ${event.classroom ?? ''}`
          : event.location ?? '',
    },
  ];

  return (
    <CardList
      items={events}
      loading={loading}
      emptyMessage="Nenhum evento cadastrado."
      filters={filters}
      columns={{ base: 1 }}
      toolbarAction={toolbarAction}
      renderCard={(event) => (
        <Flex
          key={event.id}
          bg="uspolis.white"
          border="1px solid"
          borderColor="uspolis.border"
          borderRadius="10px"
          overflow="hidden"
          w="100%"
        >
          <VStack align="stretch" spacing="12px" flex={1} minW={0} p="14px">
            <Flex justify="space-between" align="flex-start" gap={3}>
              <Heading size="md" color="uspolis.black" flex={1} minW={0}>
                {event.title}
              </Heading>
              <Tag flex="none" borderRadius="20px" colorScheme="blue">
                {translateCategory(event.category)}
              </Tag>
            </Flex>

            {event.description && (
              <Text fontSize="13.5px" color="uspolis.textMuted">
                {event.description}
              </Text>
            )}

            <HStack spacing="18px" flexWrap="wrap">
              <Text fontSize="13px" color="uspolis.textMuted">
                {periodFormatter(event)}
              </Text>
              <Text fontSize="13px" color="uspolis.textMuted">
                {event.building
                  ? `${event.building} - ${event.classroom ?? ''}`
                  : event.location ?? 'Sem local'}
              </Text>
            </HStack>
            <Text fontSize="12px" color="uspolis.textMuted">
              Criado em {moment(event.created_at).format('DD/MM/YYYY HH:mm')}
            </Text>

            <Divider borderColor="uspolis.border" />
            <HStack spacing="6px" flexWrap="wrap" rowGap="6px">
              <Tag
                as="button"
                onClick={() => onEdit(event)}
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
                onClick={() => onDelete(event)}
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
