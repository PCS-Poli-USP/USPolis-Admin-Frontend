import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, Flex, Text } from '@chakra-ui/react';

interface PaginationTabProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  filteredItemsLength: number;
  itemsPerPage: number;
}

function PaginationTab({
  currentPage,
  setCurrentPage,
  totalPages,
  filteredItemsLength,
  itemsPerPage,
}: PaginationTabProps) {
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  return (
    <Flex
      w={'full'}
      justify={'space-between'}
      align={'center'}
      wrap={'wrap'}
      gap={'12px'}
      mt={4}
    >
      <Text color={'gray.500'} fontSize={'sm'}>
        Mostrando{' '}
        {filteredItemsLength === 0
          ? 0
          : (safeCurrentPage - 1) * itemsPerPage + 1}{' '}
        a {Math.min(safeCurrentPage * itemsPerPage, filteredItemsLength)} de{' '}
        {filteredItemsLength} itens
      </Text>

      <Flex gap={'8px'}>
        <Button
          variant={'outline'}
          colorScheme='blue'
          leftIcon={<ChevronLeftIcon />}
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          isDisabled={safeCurrentPage === 1}
        >
          Anterior
        </Button>
        <Button
          variant={'outline'}
          rightIcon={<ChevronRightIcon />}
          colorScheme='blue'
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          isDisabled={safeCurrentPage === totalPages}
        >
          Próxima
        </Button>
      </Flex>
    </Flex>
  );
}

export default PaginationTab;
