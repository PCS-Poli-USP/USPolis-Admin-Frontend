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
import { CardFilter } from '../../components/common/CardList/CardFilters';

import { CurriculumResponse } from '../../models/http/responses/curriculum.response.models';

interface Props {
  curriculums: CurriculumResponse[];
  loading: boolean;

  handleEditClick: (
    curriculum: CurriculumResponse,
  ) => void;

  handleDeleteClick: (
    curriculum: CurriculumResponse,
  ) => void;

  handleViewSubjects: (
    curriculum: CurriculumResponse,
  ) => void;
  toolbarAction: ReactNode;
}

export default function CurriculumCardList({
  curriculums,
  loading,
  handleEditClick,
  handleDeleteClick,
  handleViewSubjects,
  toolbarAction,
}: Props) {
  const filters: CardFilter<CurriculumResponse>[] = [
    {
      key: 'description',
      label: 'Descrição',
      type: 'text',
      placeholder: 'Buscar por descrição',
    },
    {
      key: 'AAC',
      label: 'AAC',
      type: 'text',
      placeholder: 'Buscar por AAC',
    },
    {
      key: 'AEX',
      label: 'AEX',
      type: 'text',
      placeholder: 'Buscar por AEX',
    },
    {
      key: 'codcur',
      label: 'CODCUR',
      type: 'text',
      placeholder: 'Buscar por CODCUR',
    },
    {
      key: 'codhab',
      label: 'CODHAB',
      type: 'text',
      placeholder: 'Buscar por CODHAB',
    },
  ];

  return (
    <CardList
      items={curriculums}
      loading={loading}
      emptyMessage="Nenhum currículo cadastrado."
      filters={filters}
      columns={{ base: 1 }}
      toolbarAction={toolbarAction}
      renderCard={(curriculum) => (
        <Flex
          key={curriculum.id}
          bg="uspolis.white"
          border="1px solid"
          borderColor="uspolis.border"
          borderRadius="10px"
          overflow="hidden"
          w="100%"
        >
          <VStack align="stretch" spacing="12px" flex={1} minW={0} p="14px">
            <Heading
              size="md"
              color="uspolis.black"
              overflowWrap="anywhere"
            >
              {curriculum.description}
            </Heading>

            <Flex
              wrap="wrap"
              columnGap="18px"
              rowGap="6px"
              fontSize="13.5px"
              color="uspolis.textMuted"
            >
              {[
                { label: 'AAC', value: curriculum.AAC },
                { label: 'AEX', value: curriculum.AEX },
                { label: 'CODCUR', value: curriculum.codcur },
                { label: 'CODHAB', value: curriculum.codhab },
              ].map(({ label, value }) => (
                <HStack key={label} spacing="7px">
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
                onClick={() => handleViewSubjects(curriculum)}
                size="lg"
                variant="outline"
                colorScheme="blue"
                cursor="pointer"
                gap="6px"
              >
                <BsBook size={12} />
                Ver disciplinas
              </Tag>
              <Tag
                as="button"
                onClick={() => handleEditClick(curriculum)}
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
                onClick={() => handleDeleteClick(curriculum)}
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