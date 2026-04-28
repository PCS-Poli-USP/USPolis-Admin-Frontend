import {
  Box,
  Button,
  Flex,
  Heading,
  Highlight,
  Image,
  Text,
} from '@chakra-ui/react';
import Header from '../Header';
import USPolisPhone from '../Images/USPolisPhone.png';
import USPolisPhoneLaptop from '../Images/USPolisPhoneLaptop.png';
import VerticalCarousel from '../VerticalCarousel';
import { items, icons } from '../carousel.items';

import { FaApple, FaMobileAlt } from 'react-icons/fa';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { IoLogoGooglePlaystore } from 'react-icons/io5';
import About from '../About';
import Footer from '../Footer/index ';

function HomeDesktopView() {
  return (
    <Flex w={'full'} direction={'column'}>
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
          <Heading textColor={'uspolis.black'} fontWeight={'bold'} size={'2xl'}>
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
            >
              Mobile
            </Button>
            <Button
              as={'a'}
              href='#section2'
              fontSize={'xl'}
              colorScheme='uspolis.blue'
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
      <Flex h={'200px'} bg={'uspolis.blue'} align={'center'} justify={'center'}>
        <Heading textColor={'white'} size={'2xl'}>
          Recursos
        </Heading>
      </Flex>
      <Box id='section2' h={'auto'}>
        <VerticalCarousel items={items} icons={icons} />
      </Box>
      <Flex
        id='section4'
        h={'200px'}
        bg={'uspolis.blue'}
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
                bg={'uspolis.black'}
                textColor={'uspolis.white'}
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
                bg={'uspolis.black'}
                textColor={'uspolis.white'}
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
      <Flex h={'200px'} bg={'uspolis.blue'} align={'center'} justify={'center'}>
        <Heading textColor={'white'} size={'2xl'}>
          Sobre
        </Heading>
      </Flex>
      <Box id='section5' bg={'uspolis.white'} h={'auto'} p={10}>
        <About />
      </Box>
      <Box
        bg={'uspolis.blue'}
        h={'200px'}
        alignContent={'center'}
        justifyContent={'center'}
        p={'50px'}
      >
        <Footer />
      </Box>
    </Flex>
  );
}
export default HomeDesktopView;
