import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  IconButton,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { PaginatedResponse } from '../../../models/http/responses/paginated.response.models';
import { PageSize } from '../../../utils/enums/pageSize.enum';
import { Select } from 'chakra-react-select';

interface PaginationDisplayProps<T> {
  title: string;
  pageResponse: PaginatedResponse<T>;
  loading: boolean;
  renderPageItem: (item: T) => React.ReactNode;
  setPageSize: (pageSize: PageSize) => void;
  setCurrentPage: (currentPage: number) => void;
  gap?: string;
  titleSize?: string;
}

function PaginationDisplay<T>({
  title,
  pageResponse,
  loading,
  renderPageItem,
  setPageSize,
  setCurrentPage,
  gap = '20px',
  titleSize = 'lg',
}: PaginationDisplayProps<T>) {
  return (
    <Flex
      direction={'column'}
      border={'1px solid'}
      borderRadius={'10px'}
      h={'full'}
      padding={'1rem'}
      gap={'20px'}
      w={'fit-content'}
      minW={'800px'}
    >
      <Flex
        position={'relative'}
        justify={'center'}
        align={'center'}
        w={'100%'}
        gap={'20px'}
      >
        <Box position={'absolute'} left={'0rem'}>
          <Text>{`Página ${pageResponse.page}/${pageResponse.total_pages} - ${pageResponse.total_items} items`}</Text>
        </Box>
        <IconButton
          aria-label='left-arrow'
          icon={<FaChevronLeft />}
          variant={'outline'}
          disabled={pageResponse.page == 1}
          onClick={() => {
            setCurrentPage(pageResponse.page - 1);
          }}
        />
        <Text fontSize={titleSize} fontWeight={'bold'}>
          {title}
        </Text>
        <IconButton
          aria-label='left-arrow'
          icon={<FaChevronRight />}
          variant={'outline'}
          disabled={pageResponse.page == pageResponse.total_pages}
          onClick={() => {
            setCurrentPage(pageResponse.page + 1);
          }}
        />
        <Box position={'absolute'} right={'0rem'}>
          <Select
            options={PageSize.values().map((val) => ({
              label: `${val} por página`,
              value: val,
            }))}
            value={{
              label: `${pageResponse.page_size} por página`,
              value: pageResponse.page_size,
            }}
            onChange={(opt) => {
              if (opt) {
                setPageSize(opt.value);
              }
            }}
          />
        </Box>
      </Flex>
      <Skeleton isLoaded={!loading}>
        <Flex
          direction={'column'}
          justify={'center'}
          align={'center'}
          gap={gap}
        >
          {pageResponse.data.map((val) => renderPageItem(val))}
          {pageResponse.data.length == 0 && (
            <Alert status='warning' borderRadius={'5px'}>
              <AlertIcon />
              Nenhuma dado encontrado
            </Alert>
          )}
        </Flex>
      </Skeleton>
    </Flex>
  );
}

export default PaginationDisplay;
