import {
  Button,
  Flex,
  Image,
  Text,
  Box,
  Heading,
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
import About from '../About';
import Footer from '../Footer/index ';

function HomeMobileView() {
  function scrollInto(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
    offset: number = -60,
  ) {
    e.preventDefault();

    const target = document.querySelector(id);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    window.scrollTo({
      top: rect.top + scrollTop + offset,
      behavior: 'smooth',
    });
  }

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
          <Heading
            mt={'60px'}
            textColor={'uspolis.uspolis.black'}
            fontWeight={'bold'}
            size={'2xl'}
          >
            <Highlight
              query={'uspolis:'}
              styles={{ textColor: 'uspolis.blue' }}
            >
              USPolis: solução para alocação de salas.
            </Highlight>
          </Heading>
          <Text textColor={'uspolis.black'}>
            Administre seus espaços e agendas, encontre os horários e as salas
            das suas disciplinas. Solicite reservas de salas. Utilizando o
            sistema administrativo distribua para alunos.
          </Text>
          <Flex direction={'column'} gap={5} mt={10}>
            <Button
              as={'a'}
              fontSize={'xl'}
              colorScheme='uspolis.blue'
              leftIcon={<FaMobileAlt />}
              href='#section4'
              onClick={(e) => scrollInto(e, '#section4')}
            >
              Mobile
            </Button>
            <Button
              as={'a'}
              href='#section2'
              fontSize={'xl'}
              colorScheme='uspolis.blue'
              leftIcon={<MdOutlineAdminPanelSettings />}
              onClick={(e) => scrollInto(e, '#section2')}
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
      <Flex
        h={'100px'}
        bg={'uspolis.blue'}
        align={'center'}
        justify={'center'}
        id='section2'
      >
        <Heading textColor={'white'} size={'2xl'}>
          Recursos
        </Heading>
      </Flex>
      <Box h={'auto'}>
        <MobileCarousel items={items} />
      </Box>
      <Flex
        id='section4'
        h={'100px'}
        bg={'uspolis.blue'}
        align={'center'}
        justify={'center'}
      >
        <Heading textColor={'white'} size={'2xl'}>
          Baixe o App
        </Heading>
      </Flex>
      <Box h={'fit-content'}>
        <Flex
          w={'auto'}
          h={'full'}
          direction={'column'}
          align={'center'}
          justify={'center'}
          p={10}
          gap={10}
          mt={'0px'}
        >
          <Flex direction={'column'} w={'full'} gap={5}>
            <Heading size={'2xl'} textAlign={'center'}>
              Aplicativo USPolis
            </Heading>
            <Text fontSize={'xl'} textAlign={'justify'}>
              Utilize o nosso aplicativo para ter acesso a todas as informações
              do nosso sistema. Monte sua grade, veja as salas disponíveis e
              muito mais.
            </Text>
            <Flex direction={'row'} gap={5} justify={'center'}>
              <Button
                as={'a'}
                href='https://play.google.com/store/apps/details?id=uspolis.lunadros'
                size={'lg'}
                leftIcon={<IoLogoGooglePlaystore />}
                mt={5}
                bg={'uspolis.black'}
                textColor={'uspolis.white'}
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
                bg={'uspolis.black'}
                textColor={'uspolis.white'}
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
      <Flex h={'100px'} bg={'uspolis.blue'} align={'center'} justify={'center'}>
        <Heading textColor={'white'} size={'2xl'}>
          Sobre
        </Heading>
      </Flex>
      <Box id='section5' bg={'uspolis.white'} h={'full'}>
        <About />
      </Box>
      <Box
        bg={'uspolis.blue'}
        h={'200px'}
        alignContent={'center'}
        justifyContent={'center'}
        p={5}
      >
        <Footer />
      </Box>
    </Flex>
  );
}

export default HomeMobileView;
