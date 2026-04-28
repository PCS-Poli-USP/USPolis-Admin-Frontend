import { Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { PiStudentFill } from 'react-icons/pi';
import { FcManager } from "react-icons/fc";

interface CollaboratorCardProps {
  name: string;
  description: string;
  iconType: 'student' | 'professor' | 'other' | 'none';
}

function CollaboratorCard({
  name,
  description,
  iconType,
}: CollaboratorCardProps) {
  function getIcon() {
    switch (iconType) {
      case 'student':
        return PiStudentFill;
      case 'professor':
        return FcManager;
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
      p={'10px'}
    >
      {icon && <Icon as={icon} boxSize={'48px'} />}
      <Flex direction={'column'} justify={'center'} align={'center'} gap={'5px'}>
        <Heading size={'sm'}>{name}</Heading>
        <Text>{description}</Text>
      </Flex>
    </Flex>
  );
}

export default CollaboratorCard;
