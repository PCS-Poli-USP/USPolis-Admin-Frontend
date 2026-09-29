import {
  Box,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';

import CardList from '../../components/common/CardList/CardList';
import ActionButtons from '../../components/common/ActionButtons/ActionButtons';

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
}

export default function CurriculumCardList({
  curriculums,
  loading,
  handleEditClick,
  handleDeleteClick,
  handleViewSubjects,
}: Props) {
  return (
    <CardList
      items={curriculums}
      loading={loading}
      emptyMessage="Nenhum currículo cadastrado."
      renderCard={(curriculum) => (
        <Box
          key={curriculum.id}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          bg="white"
          shadow="sm"
        >
          <VStack align="stretch" spacing={3}>
            <Heading size="md">
              {curriculum.description}
            </Heading>

            <Divider />

            <SimpleGrid columns={2} spacing={3}>
              <Box>
                <Text fontSize="xs" color="gray.500">
                  AAC
                </Text>
                <Text fontWeight="medium">
                  {curriculum.AAC}
                </Text>
              </Box>

              <Box>
                <Text fontSize="xs" color="gray.500">
                  AEX
                </Text>
                <Text fontWeight="medium">
                  {curriculum.AEX}
                </Text>
              </Box>

              <Box>
                <Text fontSize="xs" color="gray.500">
                  CODCUR
                </Text>
                <Text fontWeight="medium">
                  {curriculum.codcur}
                </Text>
              </Box>

              <Box>
                <Text fontSize="xs" color="gray.500">
                  CODHAB
                </Text>
                <Text fontWeight="medium">
                  {curriculum.codhab}
                </Text>
              </Box>
            </SimpleGrid>

            <Divider />

            <Flex justify="flex-end">
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
            </Flex>
          </VStack>
        </Box>
      )}
    />
  );
}