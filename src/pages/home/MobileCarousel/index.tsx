import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';

export interface MobileCarouselItem {
  title: string;
  description: string;
  image: string;
  alt: string;
}

interface VerticalCarouselProps {
  items: MobileCarouselItem[];
}

function MobileCarousel({ items }: VerticalCarouselProps) {
  const textH = 500;
  const textW = '90vw';
  const textGap = 50;

  return (
    <VStack
      w={'full'}
      h={'full'}
      p={10}
      alignItems={'center'}
      alignSelf={'center'}
      spacing={textGap}
      mb={10}
    >
      {items.map((item, index) => (
        <Flex
          key={index}
          h={`${textH}px`}
          w={`${textW}`}
          gap={5}
          direction={'column'}
          align={'center'}
          justify={'center'}
        >
          <HStack w={'strech'} spacing={2}>
            <Heading
              w={'100%'}
              maxW={'450px'}
              fontWeight={'bold'}
              size={'xl'}
              color={'black'}
              textAlign={'center'}
            >
              {item.title}
            </Heading>
          </HStack>
          <Text maxW={`${textW}`} fontSize={'xl'} textAlign={'justify'}>
            {item.description}
          </Text>
          <Box overflow={'hidden'}>
            <Image
              transition='transform 0.3s, opacity 0.3s'
              src={item.image}
              alt={item.alt}
              objectFit={'fill'}
              aspectRatio={1919 / 964}
              // maxH={`${imageH}px`}
              // maxW={`${imageW}px`}
              // w='100%' // Para garantir que a imagem preencha o Box
              // h={'100%'}
              borderRadius={'lg'}
              border={'2px solid'}
              borderColor={'black'}
            />
          </Box>
        </Flex>
      ))}
    </VStack>
  );
}

export default MobileCarousel;
