import { Flex, Heading, Icon, Image, Link, Text } from '@chakra-ui/react';
import { PiStudentFill } from 'react-icons/pi';
import { Colaborator } from '..';
import { FaGithub, FaLinkedin, FaUserTie } from 'react-icons/fa';

function CollaboratorCard({
  name,
  description,
  iconType,
  linkedin,
  github,
  image,
}: Colaborator) {
  function getIcon() {
    switch (iconType) {
      case 'student':
        return PiStudentFill;
      case 'professor':
        return FaUserTie;
      case 'none':
        return null;
      default:
        return null;
    }
  }

  const icon = getIcon();

  return (
    <Flex
      border={'1px solid'}
      borderRadius={'1rem'}
      direction={'column'}
      gap={'10px'}
      justify={'center'}
      align={'center'}
      p={'1rem'}
      // w={'fit-content'}
    >
      {!image && icon && <Icon as={icon} boxSize={'48px'} />}
      {image && (
        <Image
          src={image}
          alt={name}
          boxSize='64px'
          borderRadius='full'
          // border={'2px solid'}
          boxShadow={'5px 5px 10px #888888'}
        />
      )}
      <Flex
        direction={'column'}
        justify={'center'}
        align={'center'}
        gap={'5px'}
      >
        <Heading size={'sm'}>{name}</Heading>
        <Text>{description}</Text>
      </Flex>
      <Flex direction={'row'} gap={'5px'}>
        {linkedin && (
          <Link
            as={'a'}
            textColor={'uspolis.blue'}
            fontSize={'lg'}
            isExternal
            href={linkedin}
          >
            <FaLinkedin />
          </Link>
        )}
        {github && (
          <Link
            as={'a'}
            textColor={'uspolis.blue'}
            fontSize={'lg'}
            isExternal
            href={github}
          >
            <FaGithub />
          </Link>
        )}
      </Flex>
    </Flex>
  );
}

export default CollaboratorCard;
