import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import { appContext } from '../../context/AppContext';
import { useContext, useEffect } from 'react';
import { HiUserGroup } from 'react-icons/hi';
import LoadingPage from '../../components/common/LoadingPage';
import Page401 from '../page401';
import ProfileHeader from './ProfileHeader/profile.header';
import ProfileStatusRow from './ProfileStatusRow/profile.statusrow';
import ProfileRoles from './ProfileRoles/profile.roles';
import ProfileLegacyGroups from './ProfileLegacyGroups/profile.legacygroups';

function Profile() {
  const { loggedUser, loading, isAuthenticated, getSelfFromBackend } =
    useContext(appContext);

  useEffect(() => {
    getSelfFromBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContent center>
      {!loading && loggedUser ? (
        <Box
          w={'full'}
          maxW={'1000px'}
          border={'2px solid'}
          borderColor={'uspolis.blue'}
          borderRadius={'10px'}
          p={{ base: '16px', md: '24px' }}
        >
          <ProfileHeader />
          <ProfileStatusRow />
          <ProfileRoles />
          <ProfileLegacyGroups />

          <Flex
            align={'center'}
            justify={'space-between'}
            gap={'16px'}
            wrap={'wrap'}
            mt={'22px'}
            pt={'18px'}
            borderTop={'1px solid'}
            borderColor={'uspolis.border'}
          >
            <HStack spacing={'10px'} color={'uspolis.textMuted'}>
              <HiUserGroup size={18} />
              <Text fontSize={'13.5px'} maxW={'60ch'}>
                Falta um acesso que você deveria ter? Peça ao responsável pelo prédio ou escreva
                para <Text as={'b'} color={'uspolis.text'}>uspolis@usp.br</Text>.
              </Text>
            </HStack>
          </Flex>
        </Box>
      ) : undefined}
      {isAuthenticated && loading && <LoadingPage />}
      {!isAuthenticated && !loading ? <Page401 /> : undefined}
    </PageContent>
  );
}

export default Profile;
