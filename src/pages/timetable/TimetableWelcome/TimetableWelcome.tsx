import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { LuCalendarDays, LuDownload, LuSquarePen } from 'react-icons/lu';
import { appContext } from '../../../context/AppContext';

interface TimetableWelcomeProps {
  handleImportClick: () => void;
  handleManualClick: () => void;
}

function TimetableWelcome({
  handleImportClick,
  handleManualClick,
}: TimetableWelcomeProps) {
  const { isMobile } = useContext(appContext);

  return (
    <Flex
      direction={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      p={'16px'}
      gap={'16px'}
      maxW={'900px'}
      margin={'0rem auto 10% auto'}
    >
      <Box
        borderRadius={'full'}
        bgColor={'uspolis.blue'}
        w={'96px'}
        h={'96px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Icon as={LuCalendarDays} boxSize={'64px'} color={'white'} />
      </Box>

      <Heading textAlign={'center'}>Bem-vindo à sua grade horária</Heading>
      <Text align={'center'}>
        Crie e gerencie suas turmas de forma simples e eficiente. Escolha como
        deseja iniciar.
      </Text>

      <Flex
        direction={isMobile ? 'column' : 'row'}
        w={'full'}
        // maxWidth={isMobile ? '70%' : '100%'}
        gap={'32px'}
        mt={'20px'}
      >
        <Flex
          direction={'column'}
          align={'center'}
          justify={'center'}
          gap={'12px'}
          borderRadius={'2rem'}
          padding={'2rem'}
          border={'1px solid black'}
          w={'100%'}
        >
          <Box
            borderRadius={'full'}
            bgColor={'uspolis.blue'}
            w={'64px'}
            h={'64px'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Icon as={LuDownload} boxSize={'32px'} color={'white'} />
          </Box>
          <Text fontWeight={'bold'} fontSize={'1.5rem'}>
            Importar grade
          </Text>
          <Text align={'center'}>
            Importe sua grade através do JúpiterWeb. Sua grade será
            automaticamente carregada e ficará disponível para você.
          </Text>
          <Button mt={'10px'} onClick={handleImportClick}>
            Importar do JúpiterWeb
          </Button>
        </Flex>

        <Flex
          direction={'column'}
          align={'center'}
          justify={'center'}
          gap={'12px'}
          borderRadius={'2rem'}
          padding={'2rem'}
          border={'1px solid black'}
          w={'100%'}
        >
          <Box
            borderRadius={'full'}
            bgColor={'uspolis.blue'}
            w={'64px'}
            h={'64px'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Icon as={LuSquarePen} boxSize={'32px'} color={'white'} />
          </Box>
          <Text fontWeight={'bold'} fontSize={'1.5rem'}>
            Criação manual
          </Text>
          <Text align={'center'}>
            Crie sua grade manualmente. Tenha controle total sobre suas turmas e
            horários, edite sua grade conforme necessário.
          </Text>
          <Button mt={'10px'} onClick={handleManualClick}>
            Criar manualmente
          </Button>
        </Flex>
      </Flex>

      <Flex direction={'row'} w={'full'} justify={'space-evenly'} mt={'20px'}>
        <Flex direction={'column'}>
          <Text fontWeight={'bold'} align={'center'}>
            📆 Agenda Visual
          </Text>
          <Text align={'center'}>Sua grade semanal em um olhar.</Text>
        </Flex>
        <Flex direction={'column'} justify={'center'} align={'center'}>
          <Text fontWeight={'bold'} align={'center'}>
            📍 Localize-se
          </Text>
          <Text align={'center'}>Veja onde serão suas aulas.</Text>
        </Flex>
        <Flex direction={'column'} justify={'center'} align={'center'}>
          <Text fontWeight={'bold'} align={'center'}>
            🗓️ Organize-se
          </Text>
          <Text align={'center'}>Planeje seus horários.</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default TimetableWelcome;
