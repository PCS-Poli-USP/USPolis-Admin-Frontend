import {
  Button,
  Flex,
  Image,
  Text,
  Box,
  Heading,
  ListItem,
  UnorderedList,
  Highlight,
} from '@chakra-ui/react';

import MobileHeader from '../MobileHeader';
import USPolisPhone from '../Images/USPolisPhone.png';
import USPolisPhoneLaptop from '../Images/USPolisPhoneLaptop.png';
import MobileCarousel from '../MobileCarousel';
import { items } from '../carousel.items';

import { FaApple, FaMobileAlt } from 'react-icons/fa';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { IoLogoGooglePlaystore } from 'react-icons/io5';

function HomeMobileView() {
  return (
    <Flex w={'full'} direction={'column'} overflowY='hidden'>
      <MobileHeader />
      <Flex
        id='section1'
        direction={'column'}
        h={'calc(100vh)'}
        w={'full'}
        align={'center'}
        justify={'center'}
        p={10}
        gap={10}
      >
        <Flex direction={'column'} w={'full'} gap={5}>
          <Box bg={'white'} h={'60px'} w={'full'} />
          <Heading textColor={'black'} fontWeight={'bold'} size={'2xl'}>
            <Highlight query={'uspolis:'} styles={{ textColor: 'uspolis.blue' }}>
              USPolis: solução para alocação de salas.
            </Highlight>
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
          boxSize={'full'}
        />
      </Flex>
      <Flex h={'100px'} bg={'teal'} align={'center'} justify={'center'}>
        <Heading textColor={'white'} size={'2xl'}>
          Recursos
        </Heading>
      </Flex>
      <Box id='section2' h={'auto'}>
        <MobileCarousel items={items} />
      </Box>
      <Flex
        id='section4'
        h={'100px'}
        bg={'teal'}
        align={'center'}
        justify={'center'}
      >
        <Heading textColor={'white'} size={'2xl'}>
          Baixe o App
        </Heading>
      </Flex>
      <Box h={'calc(100vh - 150px)'}>
        <Flex
          w={'auto'}
          h={'full'}
          direction={'column'}
          align={'center'}
          justify={'center'}
          p={10}
          gap={10}
        >
          <Flex direction={'column'} w={'full'} gap={5}>
            <Heading size={'2xl'}>Aplicativo USPolis</Heading>
            <Text fontSize={'xl'}>
              Utilize o nosso aplicativo para ter acesso a todas as informações
              do nosso sistema. Monte sua grade, veja as salas disponíveis e
              muito mais.
            </Text>
            <Flex direction={'row'} gap={5}>
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
                <Text>Google Play</Text>
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
                <Text>Apple Store</Text>
              </Button>
            </Flex>
          </Flex>
          <Image
            src={USPolisPhone}
            alt='USPolisPhone'
            objectFit={'contain'}
            boxSize={'400px'}
          />
        </Flex>
      </Box>
      <Flex h={'100px'} bg={'teal'} align={'center'} justify={'center'}>
        <Heading textColor={'white'} size={'2xl'}>
          Sobre
        </Heading>
      </Flex>
      <Box id='section5' bg={'white'} h={'full'}>
        <Flex
          h={'full'}
          direction={'column'}
          align={'center'}
          justify={'center'}
          gap={10}
          p={10}
        >
          <Flex
            direction={'column'}
            h={'100%'}
            w={'100%'}
            p={5}
            gap={5}
            mr={30}
          >
            <Text fontSize={'xl'} textColor={'black'} textAlign={'justify'}>
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
          <Flex direction={'column'} gap={5} h={'100%'} w={'100%'}>
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
            w={'100%'}
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
        h={'120px'}
        alignContent={'center'}
        justifyContent={'center'}
        p={5}
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

export default HomeMobileView;
