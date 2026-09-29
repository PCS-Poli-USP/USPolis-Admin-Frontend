import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import TooltipSelect from '../../../components/common/TooltipSelect';

const PAGE_SIZES = [10, 20, 30, 50];

interface PagerProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

function Pager({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PagerProps) {
  if (totalItems === 0) return null;

  return (
    <Flex
      align={'center'}
      justify={'space-between'}
      wrap={'wrap'}
      gap={'10px'}
      mt={'4px'}
    >
      <Text fontSize={'12.5px'} color={'uspolis.gray'}>
        {`${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
      </Text>
      <Flex align={'center'} gap={'8px'}>
        <IconButton
          aria-label={'página anterior'}
          icon={<ChevronLeftIcon />}
          size={'sm'}
          variant={'outline'}
          isDisabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />
        <Text fontSize={'13px'} whiteSpace={'nowrap'}>
          {`Página ${page} de ${totalPages}`}
        </Text>
        <IconButton
          aria-label={'próxima página'}
          icon={<ChevronRightIcon />}
          size={'sm'}
          variant={'outline'}
          isDisabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        />
        <Box w={'150px'}>
          <TooltipSelect
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 1500 }) }}
            value={{ label: `${pageSize} por página`, value: pageSize }}
            options={PAGE_SIZES.map((size) => ({
              label: `${size} por página`,
              value: size,
            }))}
            onChange={(option) => {
              if (option) onPageSizeChange(Number(option.value));
            }}
          />
        </Box>
      </Flex>
    </Flex>
  );
}

export default Pager;
export { PAGE_SIZES };
