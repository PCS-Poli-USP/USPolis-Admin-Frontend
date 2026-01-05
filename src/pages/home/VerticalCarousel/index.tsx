import {
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Link,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { IconType } from 'react-icons';

export interface VerticalCarouselItem {
  icon: CarouselIconProps;
  title: string;
  description: string;
  image: string;
  alt: string;
}

interface VerticalCarouselProps {
  icons: CarouselIconProps[];
  items: VerticalCarouselItem[];
  fadeDuration?: number;
}

export interface CarouselIconProps {
  id: string;
  text: string;
  icon: IconType;
}

function CarouselIcon({ id, text, icon }: CarouselIconProps) {
  return (
    <Link href={`#${id}`} _hover={{ textDecoration: 'none' }}>
      <Flex
        direction={'row'}
        justify={'center'}
        align={'center'}
        gap={2}
        _hover={{ cursor: 'pointer' }}
      >
        <Icon as={icon} boxSize={'40px'} />
        <Text textColor={'uspolis.black'} fontSize={'lg'}>
          {text}
        </Text>
      </Flex>
    </Link>
  );
}

function VerticalCarousel({ items, icons }: VerticalCarouselProps) {
  const boxH = 200;
  const imageH = 401;
  const imageW = 800;
  const textH = 500;
  const textGap = 100;

  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) {
        return;
      }
      const scrollY = window.scrollY;
      const { top } = containerRef.current.getBoundingClientRect();
      const componentTop = top + scrollY;
      if (
        scrollY - componentTop - boxH + 60 >=
        (items.length - 1) * (textH + textGap)
      ) {
        return;
      }
      const index = Math.floor(
        (scrollY - componentTop - boxH + 60 + textGap / 2) /
          (textH + textGap / 2),
      );
      if (index >= 0 && index < items.length && index !== currentImageIndex) {
        setCurrentImageIndex(index);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImageIndex]);

  return (
    <Box ref={containerRef} h={'full'}>
      <Box h={`${boxH}px`} w={'full'}>
        <Flex
          direction={'row'}
          h={'full'}
          w={'full'}
          justify={'center'}
          align={'center'}
          gap={10}
        >
          {icons.map((icon, index) => (
            <CarouselIcon key={index} {...icon} />
          ))}
        </Flex>
      </Box>
      <Flex direction={'row'} justify={'center'} align={'start'} gap={100}>
        <VStack
          w={'40%'}
          alignItems={'center'}
          alignSelf={'center'}
          spacing={textGap}
        >
          {items.map((item, index) => (
            <Flex
              id={item.icon.id}
              key={index}
              h={`${textH}px`}
              gap={5}
              w={'full'}
              direction={'column'}
              align={'center'}
              justify={'center'}
            >
              <HStack w={'strech'} spacing={2}>
                <Icon as={item.icon.icon} boxSize={'40px'} />
                <Heading
                  w={'100%'}
                  maxW={'450px'}
                  fontWeight={'bold'}
                  size={'xl'}
                  color={'uspolis.black'}
                  textAlign={'center'}
                >
                  {item.title}
                </Heading>
              </HStack>
              <Text maxW={'400px'} fontSize={'xl'} textAlign={'justify'}>
                {item.description}
              </Text>
            </Flex>
          ))}
          <Box h={`${textGap}px`}></Box>
        </VStack>
        <Box
          // borderRadius={'lg'}
          // overflow={'hidden'}
          h={`${textH + textGap - 60}px`}
          position={'sticky'}
          top={'100px'}
          alignSelf='flex-start'
          w={'auto'}
          // mt={relativeScroll > 0 ? `${relativeScroll}px` : '0px'}
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
              objectFit={'fill'}
              maxH={`${imageH}px`}
              maxW={`${imageW}px`}
              w='100%' // Para garantir que a imagem preencha o Box
              h={'100%'}
              borderRadius={'lg'}
              border={'2px solid'}
              borderColor={'uspolis.black'}
            />
          </Tooltip>
        </Box>
      </Flex>
    </Box>
  );
}

export default VerticalCarousel;
