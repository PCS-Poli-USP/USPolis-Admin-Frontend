import {
  Box,
  Flex,
  Heading,
  Icon,
  Image,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { IconType } from 'react-icons';
import { BsCalendar3 } from 'react-icons/bs';
import { LuCalendarClock } from 'react-icons/lu';
import { MdAddChart, MdOutlinePendingActions } from 'react-icons/md';

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

interface CarouselIconProps {
  text: string;
  icon: IconType;
}

function CarouselIcon({ text, icon }: CarouselIconProps) {
  return (
    <Flex direction={'row'} justify={'center'} align={'center'} gap={2}>
      <Icon as={icon} boxSize={'40px'} />
      <Text textColor={'black'} fontSize={'lg'}>{text}</Text>
    </Flex>
  );
}

function VerticalCarousel({ items }: VerticalCarouselProps) {
  const boxH = 200;
  const imageH = 800;
  const textH = 500;
  const textGap = 100;

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
        scrollY - componentTop - boxH + 60 >=
        (items.length - 1) * (textH + textGap)
      ) {
        return;
      }
      const index = Math.floor(
        (scrollY - componentTop - boxH + 60 + textGap / 2) / (textH + textGap),
      );
      if (index >= 0 && index < items.length && index !== currentImageIndex) {
        setCurrentImageIndex(index);
      }
      setRelativeScroll(scrollY - componentTop - boxH / 2);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImageIndex]);

  return (
    <Box ref={containerRef} h={'full'} overflowY={'hidden'}>
      <Box h={`${boxH}px`} w={'full'}>
        <Flex
          direction={'row'}
          h={'full'}
          w={'full'}
          justify={'center'}
          align={'center'}
          gap={10}
        >
          <CarouselIcon icon={BsCalendar3} text='Mapa de salas' />
          <CarouselIcon icon={MdOutlinePendingActions} text='Reservas e Solicitações' />
          <CarouselIcon icon={LuCalendarClock} text='Datas e Calendários' />
          <CarouselIcon icon={MdAddChart} text='Oferecimentos' />
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
              key={index}
              h={`${textH}px`}
              gap={10}
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
          <Box h={0}></Box>
        </VStack>
        <Box
          // borderRadius={'lg'}
          overflow={'hidden'}
          h={`${textH + textGap - 60}px`}
          w={'auto'}
          mt={relativeScroll > 0 ? `${relativeScroll}px` : '0px'}
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
              maxH={`${textH + textGap}px`}
              maxW={imageH}
              w='100%' // Para garantir que a imagem preencha o Box
              h={'100%'}
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
