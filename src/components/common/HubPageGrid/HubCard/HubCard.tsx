import { Flex, Text } from '@chakra-ui/react';
import { HubPageGridItem } from '..';

function HubCard({
  icon,
  title,
  description,
  pageCount,
  onClick,
  disabled = false,
}: HubPageGridItem) {
  return (
    <Flex
      direction={'column'}
      alignItems='center'
      p={'25px'}
      bg='uspolis.white'
      rounded='md'
      boxShadow='md'
      border='1px solid #408080'
      cursor='pointer'
      onClick={() => {
        if (disabled) return;
        onClick();
      }}
      opacity={disabled ? 0.5 : 1}
      pointerEvents={disabled ? 'none' : 'auto'}
      _hover={{
        animation: 'scaleIn 0.8s ease-out',
        opacity: 0.8,
        '@keyframes scaleIn': {
          from: {
            opacity: 1,
            transform: 'scale(0.9)',
          },
          to: {
            opacity: 1,
            transform: 'scale(1.1)',
          },
        },
      }}
    >
      {icon}
      <Text fontWeight={'bold'} fontSize={'xl'} mt={'20px'}>
        {title}
      </Text>
      <Text w={'100%'} textAlign={'center'}>
        {description}
      </Text>
      {pageCount && (
        <Text fontSize='sm' color='gray.500'>
          {pageCount} páginas disponíveis
        </Text>
      )}
    </Flex>
  );
}

export default HubCard;
