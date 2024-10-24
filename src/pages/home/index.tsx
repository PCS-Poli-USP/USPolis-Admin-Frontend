import { Box, Button, Flex, Heading, Image, Text } from '@chakra-ui/react';
import Header from './Header';
import USPolisPhoneLaptop from './Images/USPolisPhoneLaptop.png';
import { FaMobileAlt } from 'react-icons/fa';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import VerticalCarousel from './VerticalCarousel';
import { items } from './carousel.items';

function Home() {
  return (
    <Flex w={'full'} direction={'column'} overflowY='hidden'>
      <Header />
      <Flex
        id='section1'
        direction={'row'}
        h={'calc(100vh - 60px)'}
        w={'full'}
        mt={'60px'}
        align={'center'}
        justify={'center'}
        gap={10}
      >
        <Flex direction={'column'} w={'500px'} gap={5}>
          <Heading textColor={'black'} fontWeight={'bold'} size={'2xl'}>
            Uspolis: solução para alocação de salas.
          </Heading>
          <Text textColor={'black'}>
            Administre seus espaços e agendas, encontre os horários e as salas
            das suas disciplinas. Solicite reservas de salas. Utilizando o
            sistema administrativo distribua para alunos.
          </Text>
          <Flex direction={'column'} gap={5} mt={10}>
            <Button
              fontSize={'xl'}
              colorScheme='teal'
              leftIcon={<FaMobileAlt />}
            >
              Mobile
            </Button>
            <Button
              fontSize={'xl'}
              colorScheme='teal'
              leftIcon={<MdOutlineAdminPanelSettings />}
            >
              Administrativo
            </Button>
          </Flex>
        </Flex>
        <Image
          src={USPolisPhoneLaptop}
          alt='USPolisPhone'
          objectFit={'contain'}
          boxSize={'800px'}
        />
      </Flex>
      <Flex h={'200px'} bg={'teal'} align={'center'} justify={'center'}>
        <Heading textColor={'white'} size={'2xl'}>
          Recursos
        </Heading>
      </Flex>
      <Box id='section2' h={'auto'}>
        <VerticalCarousel items={items} />
      </Box>
      <Flex h={'200px'} bg={'teal'} align={'center'} justify={'center'}>
        <Heading textColor={'white'} size={'2xl'}>
          Baixe o App
        </Heading>
      </Flex>
      <Box id='section3' bg={'grey'} h={'600px'}></Box>
      <Flex h={'200px'} bg={'teal'} align={'center'} justify={'center'}>
        <Heading textColor={'white'} size={'2xl'}>
          Sobre
        </Heading>
      </Flex>
      <Box id='section5' bg={'grey'} h={'600px'}></Box>
    </Flex>
  );
}

export default Home;
