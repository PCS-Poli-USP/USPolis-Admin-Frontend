import {
  Box,
  Divider,
  Flex,
  HStack,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';

import CardList from '../../components/common/CardList/CardList';

import { CurriculumSubjectResponse } from '../../models/http/responses/curriculumSubject.response.models';
import { SubjectResponseBase } from '../../models/http/responses/subject.response.models';

interface Props {
  items: CurriculumSubjectResponse[];
  subjects: SubjectResponseBase[];
  loading: boolean;
  handleEditClick: (item: CurriculumSubjectResponse) => void;
  handleDeleteClick: (item: CurriculumSubjectResponse) => void;
}

export default function CurriculumSubjectCardList({
  items,
  subjects,
  loading,
  handleEditClick,
  handleDeleteClick,
}: Props) {
  const subjectMap = Object.fromEntries(
    subjects.map((subject) => [
      subject.id,
      `${subject.code} - ${subject.name}`,
    ]),
  );

  const typeMap: Record<string, string> = {
    SEMESTRAL: 'Semestral',
    QUADRIMESTER: 'Quadrimestral',
  };

  const categoryMap: Record<string, string> = {
    mandatory: 'Obrigatória',
    free_elective: 'Optativa Livre',
    track_elective: 'Optativa Eletiva',
  };

  return (
    <CardList
      items={items}
      loading={loading}
      emptyMessage="Nenhuma disciplina cadastrada neste período."
      columns={{ base: 1 }}
      renderCard={(item) => (
        <Box
          key={item.id}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          bg="uspolis.white"
          shadow="sm"
        >
          <VStack align="stretch" spacing={3}>
            <Text
              fontWeight="bold"
              fontSize="md"
              wordBreak="break-word"
            >
              {subjectMap[item.subject_id] ?? '-'}
            </Text>

            <Divider />

            <Flex
              wrap="wrap"
              columnGap="18px"
              rowGap="6px"
              fontSize="13.5px"
              color="uspolis.textMuted"
            >
              {[
                { label: 'Tipo', value: typeMap[item.type] ?? item.type },
                {
                  label: 'Categoria',
                  value: categoryMap[item.category] ?? item.category,
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

            <Divider />

            <HStack
              spacing="6px"
              flexWrap="wrap"
              rowGap="6px"
              onClick={(event) => event.stopPropagation()}
            >
              <Tag
                as="button"
                onClick={() => handleEditClick(item)}
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
                onClick={() => handleDeleteClick(item)}
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
        </Box>
      )}
    />
  );
}