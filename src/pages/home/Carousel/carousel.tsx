import {
  Box,
  Image,
  IconButton,
  Progress,
  VStack,
  Heading,
  Text,
  HStack,
  ScaleFade,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import { CarouselProps } from './carousel.interface';

export default function Carousel({
  images,
  autoSlideInterval = 4000,
  autoSlide = false,
  fadeDuration = 300,
}: CarouselProps) {
  const progressGap = 100 / images.length;

  const [isSliding, setIsSliding] = useState(true);
  const [progress, setProgress] = useState(progressGap);
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = async () => {
    setIsSliding(false);
    setTimeout(() => {
      setProgress((prev) =>
        prev - progressGap < 0 + progressGap / 2 ? 100 : prev - progressGap,
      );
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1,
      );
      setIsSliding(true);
    }, fadeDuration);
  };

  const nextSlide = async () => {
    setIsSliding(false);
    setTimeout(() => {
      setIsSliding(true);
      setProgress((prev) =>
        prev + progressGap > 100 + progressGap / 2
          ? progressGap
          : prev + progressGap,
      );
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1,
      );
    }, fadeDuration);
  };

  useEffect(() => {
    if (autoSlide) {
      const interval = setInterval(() => nextSlide(), autoSlideInterval);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      w={{ base: '300px', md: '800px' }}
      mx='auto'
      position='relative'
      overflow='hidden'
    >
      <HStack spacing={2} w={'full'} justifyContent={'center'}>
        <IconButton
          aria-label='right-arrow'
          onClick={() => {
            prevSlide();
          }}
          isRound
        >
          <BiLeftArrowAlt size='40px' />
        </IconButton>

        <VStack
          spacing={4}
          align='center'
          w={'fit-content'}
          justifyContent={'center'}
        >
          <Heading>{images[currentIndex].title}</Heading>
          <ScaleFade in={isSliding} initialScale={0.9}>
            <Box w={'100%'}>
              <Image
                src={images[currentIndex].src}
                alt={`Slide ${currentIndex + 1}`}
                width='100%'
                height='400px'
                objectFit='cover'
                borderRadius='md'
                transition='all 0.5s'
              />
            </Box>
          </ScaleFade>
          <Text w={'full'} textAlign={'center'}>
            {images[currentIndex].text}
          </Text>
          <Progress
            w={'full'}
            mt={4}
            value={progress}
            size='xs'
            colorScheme='teal'
            transition='width 0.5s ease-in-out'
            sx={{
              '& div[role="progressbar"]': {
                transition: 'width 0.5s ease-in-out',
              },
            }}
          />
        </VStack>

        <IconButton
          aria-label='right-arrow'
          onClick={() => {
            nextSlide();
          }}
          isRound
        >
          <BiRightArrowAlt size='40px' />
        </IconButton>
      </HStack>
      {/* <Progress
        w={'full'}
        mt={4}
        value={progress}
        size='xs'
        colorScheme='teal'
        transition='width 0.5s ease-in-out'
        sx={{
          '& div[role="progressbar"]': {
            transition: 'width 0.5s ease-in-out',
          },
        }}
      /> */}
    </Box>
  );
}
