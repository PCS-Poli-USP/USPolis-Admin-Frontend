import {
  Badge,
  Box,
  Divider,
  Flex,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';

import CardList from '../../components/common/CardList/CardList';
import ActionButtons from '../../components/common/ActionButtons/ActionButtons';

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

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'mandatory':
        return 'green';
      case 'free_elective':
        return 'green';
      case 'track_elective':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <CardList
      items={items}
      loading={loading}
      emptyMessage="Nenhuma disciplina cadastrada neste período."
      renderCard={(item) => (
        <Box
          key={item.id}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          bg="white"
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

            <SimpleGrid columns={2} spacing={3}>
              <Box>
                <Text fontSize="xs" color="gray.500">
                  Tipo
                </Text>

                <Badge>
                  {typeMap[item.type] ?? item.type}
                </Badge>
              </Box>

              <Box>
                <Text fontSize="xs" color="gray.500">
                  Categoria
                </Text>

                <Badge
                  colorScheme={getCategoryBadgeColor(item.category)}
                >
                  {categoryMap[item.category] ?? item.category}
                </Badge>
              </Box>
            </SimpleGrid>

            <Divider />

            <Flex justify="flex-end">
              <ActionButtons
                onEdit={() => handleEditClick(item)}
                onDelete={() => handleDeleteClick(item)}
              />
            </Flex>
          </VStack>
        </Box>
      )}
    />
  );
}