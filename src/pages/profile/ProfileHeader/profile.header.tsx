import { Flex, HStack, Tag, Text, VStack, Wrap } from '@chakra-ui/react';
import { useContext } from 'react';
import moment from 'moment';
import { appContext } from '../../../context/AppContext';
import UserImage from '../../../components/common/UserImage/user.image';
import {
  getUserRole,
  getUserRoleBadgeColor,
  hasElevatedAccess,
} from '../../../utils/users/users.formatter';

function ProfileHeader() {
  const { loggedUser } = useContext(appContext);
  if (!loggedUser) return null;

  return (
    <Flex
      align={{ base: 'center', sm: 'flex-start' }}
      direction={{ base: 'column', sm: 'row' }}
      gap={{ base: '14px', sm: '24px' }}
      pb={'22px'}
      borderBottom={'1px solid'}
      borderColor={'uspolis.border'}
      textAlign={{ base: 'center', sm: 'left' }}
    >
      <UserImage boxSize='104px' />

      <VStack align={{ base: 'center', sm: 'flex-start' }} spacing={'10px'} flex={1} minW={0} w={'full'}>
        <Text fontSize={{ base: '22px', md: '26px' }} fontWeight={'bold'} color={'uspolis.text'} lineHeight={1.2}>
          {loggedUser.name}
        </Text>

        <HStack spacing={'8px'} wrap={'wrap'} justify={{ base: 'center', sm: 'flex-start' }}>
          {hasElevatedAccess(loggedUser) && (
            <Tag
              colorScheme={getUserRoleBadgeColor(loggedUser)}
              fontSize={'11.5px'}
              fontWeight={'bold'}
              letterSpacing={'0.04em'}
              textTransform={'uppercase'}
              borderRadius={'4px'}
            >
              {getUserRole(loggedUser)}
            </Tag>
          )}
          {loggedUser.curriculum && (
            <Text fontSize={'14px'} color={'uspolis.textMuted'}>
              {loggedUser.curriculum.description}
            </Text>
          )}
        </HStack>

        <Wrap spacing={'6px 28px'} fontSize={'14px'} color={'uspolis.text'} justify={{ base: 'center', sm: 'flex-start' }}>
          <Text>
            <Text as={'b'}>Email:</Text> {loggedUser.email}
          </Text>
          <Text color={'uspolis.textMuted'}>
            <Text as={'b'}>Último acesso:</Text>{' '}
            {moment(loggedUser.last_visited).format('DD/MM/YYYY [às] HH:mm')}
          </Text>
        </Wrap>
      </VStack>
    </Flex>
  );
}

export default ProfileHeader;
