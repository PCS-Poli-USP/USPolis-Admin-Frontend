import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import Logo from 'assets/uspolis.logo.png';
import { ReactElement } from 'react';
import {
  FaAppStore,
  FaCalendarAlt,
  FaCalendarCheck,
  FaCalendarDay,
  FaChalkboard,
  FaGooglePlay,
  FaPen,
  FaUsers,
} from 'react-icons/fa';
import { LockIcon, UnlockIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import Carousel from 'pages/home/Carousel/carousel';
import { CarouselImage } from './Carousel/carousel.interface';

// TODO: uspolis page
function Home() {
  const images: CarouselImage[] = [
    {
      src: 'https://images.unsplash.com/photo-1612852098516-55d01c75769a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60',
      alt: 'Slide 1',
      title: 'Mapa de Salas',
      text: 'Encontre sua sala de aula, busque por disciplinas e turmas',
    },
    {
      alt: 'Slide 2',
      title: 'Slide 2',
      text: 'Slide 2',
      src: 'https://images.unsplash.com/photo-1627875764093-315831ac12f7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60',
    },
    {
      alt: 'Slide 3',
      title: 'Slide 3',
      text: 'Slide 3',
      src: 'https://images.unsplash.com/photo-1571432248690-7fd6980a1ae2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60',
    },
    {
      alt: 'Slide 4',
      title: 'Slide 4',
      text: 'Slide 4',
      src: 'https://images.unsplash.com/photo-1571432248690-7fd6980a1ae2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60',
    },
    {
      alt: 'Slide 5',
      title: 'Slide 5',
      text: 'Slide 5',
      src: 'https://images.unsplash.com/photo-1571432248690-7fd6980a1ae2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60',
    },
    {
      alt: 'Slide 6',
      title: 'Slide 6',
      text: 'Slide 6',
      src: 'https://images.unsplash.com/photo-1571432248690-7fd6980a1ae2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60',
    },
  ];

  const navigate = useNavigate();
  return (
    <Box bg='uspolis.grey' p={10}>
      <Stack direction={{ base: 'column', md: 'row' }}>
        <Flex
          p={8}
          flex={1}
          align='center'
          justify='center'
          direction={{ base: 'column', md: 'row' }}
        >
          <Stack spacing={6} w='full' maxW='lg'>
            <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
              <HStack>
                <Image
                  alt='USPolis Logo'
                  objectFit='cover'
                  boxSize={'100px'}
                  src={Logo}
                />
                <Text>USPolis</Text>
              </HStack>
              <Text fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}>
                Sistema Open-Source para alocação e visualização de salas de
                aula
              </Text>
            </Heading>
            <Text fontSize={{ base: 'md', lg: 'lg' }}>
              Sistema centralizado para alocação e visualização de salas de aula
              com propósito de resolver o Problema de Alocação de Aulas às Salas
              (PAAS) por meio de uma formulação matemática. As alocações podem
              ser visualizadas no app para Android ou IOS abaixo.
            </Text>
            <Stack direction={{ base: 'column', md: 'column' }} spacing={4}>
              <Link href='https://play.google.com/store/apps/details?id=uspolis.lunadros'>
                <Button
                  w={'full'}
                  rounded='full'
                  colorScheme='blue'
                  _hover={{
                    textDecoration: 'none',
                  }}
                  leftIcon={<FaGooglePlay />}
                >
                  Play Store
                </Button>
              </Link>
              <Link href='https://apps.apple.com/br/app/uspolis/id1451455075'>
                <Button
                  rounded='full'
                  w={'full'}
                  colorScheme='blue'
                  leftIcon={<FaAppStore />}
                  _hover={{
                    textDecoration: 'none',
                  }}
                >
                  App Store
                </Button>
              </Link>
              <Button
                rounded='full'
                colorScheme='blue'
                leftIcon={<UnlockIcon />}
                _hover={{
                  textDecoration: 'none',
                }}
                onClick={() => navigate('/allocation')}
              >
                Mapa de Salas
              </Button>
              <Button
                rounded='full'
                colorScheme='blue'
                leftIcon={<LockIcon />}
                _hover={{
                  textDecoration: 'none',
                }}
                onClick={() => navigate('/subjects')}
              >
                Área Administrativa
              </Button>
            </Stack>
          </Stack>
          <Carousel images={images} />
        </Flex>
        {/* <Flex flex={1}>
          <Image alt='USPolis Logo' objectFit='contain' src={Logo} />
        </Flex> */}
      </Stack>
      <Box p={12}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Feature
            icon={<Icon as={FaChalkboard} w={10} h={10} />}
            title='Cadastro de salas'
            text='Cadastre as informações de uma salas de forma simples e rápida através do formulário na própria página de salas'
          />
          <Feature
            icon={<Icon as={FaUsers} w={10} h={10} />}
            title='Busca informações das turmas'
            text='Busque pelas informações das turmas no Jupiterweb através do código da disciplina'
          />
          <Feature
            icon={<Icon as={FaPen} w={10} h={10} />}
            title='Edição das informações de salas e turmas'
            text='Edite as informções de cada sala ou turma através do formulário nas respectivas páginas'
          />
          <Feature
            icon={<Icon as={FaCalendarCheck} w={10} h={10} />}
            title='Alocação das turmas em salas'
            text='Aloca as turmas nas salas disponíveis automaticamente utilizando uma formulação matemática, levando em consideração as restrições definidas'
          />
          <Feature
            icon={<Icon as={FaCalendarAlt} w={10} h={10} />}
            title='Visualização da alocação calculada'
            text='Visualize a sala alocada para cada turma de 4 formas diferentes: por salas; por semana; por dia; por semana, separado por sala'
          />
          <Feature
            icon={<Icon as={FaCalendarDay} w={10} h={10} />}
            title='Edição da alocação calculada'
            text='Edite a sala alocada para um turma, escolhendo dentre as salas disponíveis para o horário da turma em questão'
          />
        </SimpleGrid>
      </Box>
    </Box>
  );
}

interface FeatureProps {
  title: string;
  text: string;
  icon: ReactElement;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack>
      <Center>
        <Flex
          w={16}
          h={16}
          align='center'
          justify='center'
          rounded='full'
          bg='gray.100'
          mb={1}
        >
          {icon}
        </Flex>
      </Center>
      <Text fontWeight={600} align='center'>
        {title}
      </Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
};

export default Home;
