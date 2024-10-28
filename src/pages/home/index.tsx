import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import Header from './Header';
import USPolisPhone from './Images/USPolisPhone.png';
import USPolisPhoneLaptop from './Images/USPolisPhoneLaptop.png';
import VerticalCarousel from './VerticalCarousel';
import { items } from './carousel.items';

import { FaApple, FaMobileAlt } from 'react-icons/fa';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { IoLogoGooglePlaystore } from 'react-icons/io5';

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
              as={'a'}
              fontSize={'xl'}
              colorScheme='teal'
              leftIcon={<FaMobileAlt />}
              href='#section4'
            >
              Mobile
            </Button>
            <Button
              as={'a'}
              href='#section2'
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
      <Flex
        id='section4'
        h={'200px'}
        bg={'teal'}
        align={'center'}
        justify={'center'}
      >
        <Heading textColor={'white'} size={'2xl'}>
          Baixe o App
        </Heading>
      </Flex>
      <Box h={'calc(100vh - 250px)'}>
        <Flex
          w={'auto'}
          h={'full'}
          direction={'row'}
          align={'center'}
          justify={'center'}
        >
          <Flex direction={'column'} maxW={'500px'} gap={5}>
            <Heading size={'2xl'}>Aplicativo USPolis</Heading>
            <Text fontSize={'xl'}>
              Utilize o nosso aplicativo para ter acesso a todas as informações
              do nosso sistema. Monte sua grade, veja as salas disponíveis e
              muito mais.
            </Text>
            <Flex direction={'row'} gap={10}>
              <Button
                as={'a'}
                href='https://play.google.com/store/apps/details?id=uspolis.lunadros'
                size={'lg'}
                leftIcon={<IoLogoGooglePlaystore />}
                mt={5}
                bg={'black'}
                textColor={'white'}
                _hover={{ bg: 'gray.500' }}
              >
                <Text noOfLines={2}>
                  Disponível no <br />
                  Google Play
                </Text>
              </Button>
              <Button
                as={'a'}
                href='https://apps.apple.com/br/app/uspolis/id1451455075'
                size={'lg'}
                leftIcon={<FaApple />}
                mt={5}
                bg={'black'}
                textColor={'white'}
                _hover={{ bg: 'gray.500' }}
              >
                <Text noOfLines={2}>
                  Disponível na <br />
                  Apple Store
                </Text>
              </Button>
            </Flex>
          </Flex>
          <Image
            src={USPolisPhone}
            alt='USPolisPhone'
            objectFit={'contain'}
            boxSize={'500px'}
          />
        </Flex>
      </Box>
      <Flex h={'200px'} bg={'teal'} align={'center'} justify={'center'}>
        <Heading textColor={'white'} size={'2xl'}>
          Sobre
        </Heading>
      </Flex>
      <Box id='section5' bg={'white'} h={'400px'}>
        <Flex
          h={'full'}
          direction={'row'}
          align={'center'}
          justify={'center'}
          gap={10}
          p={10}
        >
          <Flex
            direction={'column'}
            h={'100%'}
            maxW={'700px'}
            p={5}
            gap={5}
            mr={30}
          >
            <Text
              fontSize={'xl'}
              textColor={'black'}
              textAlign={'justify'}
            >
              O USPolis foi inicialmente desenvolvido como projeto de formatura
              no PCS, contando com um sistema de alocação automático de salas.
              Ao longo do tempo outros projetos de formatura continuaram seu
              desenvolvimento. Atualmente o USPolis possui uma bolsa PUB para
              financiar o seu desenvolvimento.
            </Text>
            <Text fontSize={'xl'} textColor={'black'} textAlign={'justify'}>
              O USPolis é um projeto open-source, caso queira contribuir, tenha
              dúvidas, sugestões ou comentários entre em contato conosco. Sua
              ajuda será mais do que bem vinda!
            </Text>
          </Flex>
          <Flex direction={'column'} gap={5} h={'100%'}>
            <Heading textColor={'black'}>Desenvolvedores</Heading>
            <UnorderedList textColor={'black'}>
              <ListItem>Daniel Hiroki Yamashita</ListItem>
              <ListItem>Gabriel Di Vanna Camargo</ListItem>
              <ListItem>Henrique Fuga Duran</ListItem>
              <ListItem>Jorge Habib El Khouri</ListItem>
              <ListItem>José Vitor Martins Makiyama</ListItem>
              <ListItem>Luiz Roberto AKio Higuti</ListItem>
              <ListItem>Marcel Makoto Kondo</ListItem>
              <ListItem>Rodrigo Kenki Aguena</ListItem>
              <ListItem>Rodrigo Miksian Magaldi</ListItem>
            </UnorderedList>
          </Flex>
          <Flex
            direction={'column'}
            gap={5}
            h={'100%'}
            justify={'flex-start'}
            align={'flex-start'}
          >
            <Heading textColor={'black'}>Orientação</Heading>
            <UnorderedList textColor={'black'}>
              <ListItem>Prof. Dr. Fábio Levy Siqueira (PCS|Poli-USP)</ListItem>
              <ListItem>Renan Ávila (criador original do USPolis)</ListItem>
            </UnorderedList>
          </Flex>
        </Flex>
      </Box>
      <Box
        bg={'teal'}
        h={'150px'}
        alignContent={'center'}
        justifyContent={'center'}
        p={10}
      >
        <Heading textColor={'white'} size={'lg'}>
          Contato:
        </Heading>
        <Text textColor={'white'} fontSize={'lg'}>
          uspolis@usp.br
        </Text>
      </Box>
    </Flex>
  );
}

export default Home;
