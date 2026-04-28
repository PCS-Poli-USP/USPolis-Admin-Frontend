import { EmailIcon } from '@chakra-ui/icons';
import { Flex, Icon, Link, Text } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <Flex direction={'column'} justify={'center'} align={'center'} gap={'5px'}>
      <Flex
        direction={'row'}
        gap={'25px'}
        align={'center'}
        w={'full'}
        justify={'center'}
      >
        <Flex direction={'row'} justify={'center'} align={'center'} gap={'4px'}>
          <Icon as={EmailIcon} boxSize={'25px'} />
          <Text textColor={'white'} fontSize={'xl'}>
            uspolis@usp.br
          </Text>
        </Flex>
        <Flex direction={'row'} justify={'center'} align={'center'} gap={'4px'}>
          <Icon as={FaGithub} boxSize={'25px'} textColor={'white'} />
          <Link
            as={'a'}
            textColor={'white'}
            fontSize={'lg'}
            isExternal
            href={'https://github.com/PCS-Poli-USP/USPolis-Admin'}
          >
            Github
          </Link>
        </Flex>
      </Flex>
      <Text textColor={'white'} fontSize={'lg'} textAlign={'center'}>
        {`© ${year} USPolis. Todos os direitos reservados.`}
      </Text>
    </Flex>
  );
}

export default Footer;
