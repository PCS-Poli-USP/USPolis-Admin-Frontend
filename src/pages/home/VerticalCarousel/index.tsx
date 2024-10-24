import { Box, Flex, Heading, Image, Text, VStack } from '@chakra-ui/react';
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
  const imageH = 500;

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
      if (scrollY >= componentTop + (items.length - 1) * (imageH + imageGap))
        return;

      const index = Math.floor(
        (scrollY - componentTop + (imageH + imageGap) / 2) /
          (imageH + imageGap),
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
              <Heading fontWeight={'bold'} size={'xl'} color={'black'}>
                {item.title}
              </Heading>
              <Text>{item.description}</Text>
            </Flex>
          ))}
        </VStack>
        <Box
          borderRadius={'lg'}
          overflow={'hidden'}
          maxH={300}
          w={'full'}
          mt={relativeScroll > 0 ? relativeScroll + 60 + imageGap : imageGap}
        >
          <Image
            src={items[currentImageIndex].image}
            alt={items[currentImageIndex].alt}
            objectFit={'cover'}
            maxH={`${imageH}px`}
            maxW={imageH}
            width='100%' // Para garantir que a imagem preencha o Box
          />
        </Box>
      </Flex>
    </Box>
  );
}

export default VerticalCarousel;
