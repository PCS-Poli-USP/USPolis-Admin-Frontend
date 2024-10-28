import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

export interface VerticalCarouselItem {
  title: string;
  description: string;
  image: string;
  alt: string;
}

interface VerticalCarouselProps {
  items: VerticalCarouselItem[];
  fadeDuration?: number;
}

function VerticalCarousel({ items }: VerticalCarouselProps) {
  const imageGap = 100;
  const imageH = 600;

  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relativeScroll, setRelativeScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) {
        return;
      }
      const scrollY = window.scrollY;
      const { top } = containerRef.current.getBoundingClientRect();
      const componentTop = top + scrollY;
      if (
        scrollY + imageGap / 2 >=
        componentTop + (items.length - 1) * (imageH + imageGap / 4)
      )
        return;

      const index = Math.floor(
        (scrollY - componentTop + (imageH + imageGap) / 2) / imageH,
      );
      if (index >= 0 && index < items.length && index !== currentImageIndex) {
        setCurrentImageIndex(index);
      }
      setRelativeScroll(scrollY - componentTop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImageIndex]);

  return (
    <Box ref={containerRef} h={'full'} overflowY={'hidden'}>
      <Flex direction={'row'} justify={'center'} align={'start'} gap={100}>
        <VStack w={'full'} alignItems={'center'} alignSelf={'center'}>
          {items.map((item, index) => (
            <Flex
              key={index}
              h={'500px'}
              mb={100}
              gap={5}
              w={'full'}
              direction={'column'}
              align={'center'}
              justify={'center'}
            >
              <Heading
                maxW={'400px'}
                fontWeight={'bold'}
                size={'xl'}
                color={'black'}
                textAlign={'center'}
              >
                {item.title}
              </Heading>
              <Text maxW={'400px'} fontSize={'xl'} textAlign={'justify'}>
                {item.description}
              </Text>
            </Flex>
          ))}
        </VStack>
        <Box
          // borderRadius={'lg'}
          overflow={'hidden'}
          maxH={`${imageH}px`}
          w={'full'}
          mt={relativeScroll > 0 ? relativeScroll + 60 + imageGap : imageGap}
          transition='transform 0.3s, opacity 0.3s'
          _hover={{
            transform: 'scale(1.1)',
            opacity: 1.0,
          }}
        >
          <Tooltip
            label={`Página de ${items[currentImageIndex].title}`}
            placement={'top'}
            w={'100%'}
          >
            <Image
              transition='transform 0.3s, opacity 0.3s'
              src={items[currentImageIndex].image}
              alt={items[currentImageIndex].alt}
              objectFit={'cover'}
              maxH={`${imageH}px`}
              maxW={imageH}
              width='100%' // Para garantir que a imagem preencha o Box
              borderRadius={'lg'}
              border={'2px solid'}
              borderColor={'black'}
            />
          </Tooltip>
        </Box>
      </Flex>
    </Box>
  );
}

export default VerticalCarousel;
