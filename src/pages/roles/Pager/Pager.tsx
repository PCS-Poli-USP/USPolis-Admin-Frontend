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

  // Desktop: item count on the left, navigation and page size grouped on the
  // right. Phones: navigation spans the first row, count and page size share
  // the second (wrapped as one group they took three rows).
  return (
    <Flex align={'center'} wrap={'wrap'} gap={'10px'} mt={'4px'}>
      <Text
        order={{ base: 2, md: 0 }}
        fontSize={'12.5px'}
        color={'uspolis.textMuted'}
      >
        {`${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
      </Text>
      <Flex
        order={{ base: 1, md: 0 }}
        w={{ base: 'full', md: 'auto' }}
        ml={{ md: 'auto' }}
        align={'center'}
        justify={{ base: 'space-between', md: 'flex-start' }}
        gap={'8px'}
      >
        <IconButton
          aria-label={'Página anterior'}
          icon={<ChevronLeftIcon />}
          size={{ base: 'md', md: 'sm' }}
          variant={'outline'}
          isDisabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />
        <Text fontSize={'13px'} whiteSpace={'nowrap'}>
          {`Página ${page} de ${totalPages}`}
        </Text>
        <IconButton
          aria-label={'Próxima página'}
          icon={<ChevronRightIcon />}
          size={{ base: 'md', md: 'sm' }}
          variant={'outline'}
          isDisabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        />
      </Flex>
      {/* 150px cut the label ("10 por pá…"). */}
      <Box order={{ base: 3, md: 0 }} w={'172px'} ml={{ base: 'auto', md: 0 }}>
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
  );
}

export default Pager;
export { PAGE_SIZES };
