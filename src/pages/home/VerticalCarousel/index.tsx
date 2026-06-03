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
  const imageH = 400;
  const imageW = 800;
  const textH = 400;
  const textGap = 250; // Espaço entre itens para permanecer mais tempo na mesma imagem
  const transitionDelay = 500; // Delay mínimo entre mudanças de imagem em ms

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRefsMap = useRef(new Map<number, HTMLDivElement>());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const lastIndexRef = useRef<number>(0);
  const lastTransitionTimeRef = useRef<number>(0);

  // Configurar Intersection Observers para cada item
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    items.forEach((_, index) => {
      const itemRef = itemsRefsMap.current?.get(index);
      if (!itemRef) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          const now = Date.now();

          // Só muda se está intersectando, é diferente do último e passou o tempo mínimo
          if (
            entry.isIntersecting &&
            lastIndexRef.current !== index &&
            now - lastTransitionTimeRef.current > transitionDelay
          ) {
            lastIndexRef.current = index;
            lastTransitionTimeRef.current = now;
            setIsAnimating(true);
            setCurrentImageIndex(index);

            // Reseta animação após conclusão
            const animationTimer = setTimeout(() => {
              setIsAnimating(false);
            }, 300);

            return () => clearTimeout(animationTimer);
          }
        },
        {
          root: null,
          rootMargin: '-50% 0px -50% 0px', // Aumentado para -50% para criar maior espaço entre mudanças
          threshold: 0,
        },
      );

      observer.observe(itemRef);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [items, transitionDelay]);

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
              ref={(el) => {
                if (el) itemsRefsMap.current?.set(index, el);
              }}
              id={item.icon.id}
              key={index}
              h={`${textH}px`}
              gap={5}
              w={'full'}
              direction={'column'}
              align={'center'}
              border={
                currentImageIndex === index
                  ? '2px solid'
                  : '2px solid transparent'
              }
              borderRadius={'2rem'}
              justify={'center'}
              transition={'all 0.3s ease-in-out'}
              _hover={{
                borderColor: 'uspolis.black',
              }}
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
              <Text maxW={'400px'} fontSize={'xl'} textAlign={'left'}>
                {item.description}
              </Text>
            </Flex>
          ))}
          <Box h={`${0}px`}></Box>
        </VStack>
        <Box
          h={`${textH + textGap - 60}px`}
          position={'sticky'}
          top={'100px'}
          alignSelf='flex-start'
          w={'auto'}
          transition='transform 0.3s, opacity 0.3s'
          _hover={{
            transform: 'scale(1.05)',
            opacity: 1.0,
          }}
        >
          <Tooltip
            label={`Página de ${items[currentImageIndex].title}`}
            placement={'top'}
            w={'100%'}
          >
            <Image
              key={currentImageIndex}
              src={items[currentImageIndex].image}
              alt={items[currentImageIndex].alt}
              objectFit={'fill'}
              maxH={`${imageH}px`}
              maxW={`${imageW}px`}
              w='100%'
              h={'100%'}
              borderRadius={'lg'}
              border={'2px solid'}
              borderColor={'uspolis.black'}
              sx={{
                animation: 'scaleIn 0.4s ease-out',
                '@keyframes scaleIn': {
                  from: {
                    opacity: 0,
                    transform: 'scale(0.95)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                },
              }}
              transition='opacity 0.3s ease-in-out'
              opacity={isAnimating ? 0.8 : 1}
            />
          </Tooltip>
        </Box>
      </Flex>
    </Box>
  );
}

export default VerticalCarousel;
