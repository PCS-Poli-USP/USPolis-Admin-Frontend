import { Flex, Image, Text } from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import { appContext } from '../../context/AppContext';
import { useContext } from 'react';

function Profile() {
  const { loggedUser } = useContext(appContext);
  console.log('loggedUser', loggedUser);
  const userInfo = loggedUser?.user_info;
  return (
    <PageContent>
      {loggedUser && userInfo ? (
        <>
          <Flex align={'center'}>
            <Text fontSize={'4xl'}>{`Bem vindo, ${userInfo.given_name}`}</Text>
          </Flex>
          <Image src={userInfo.picture} boxSize='120px' borderRadius={'full'} />
        </>
      ) : (
        <Text fontSize={'4xl'}>Entre primeiro para acessar essa página!</Text>
      )}
    </PageContent>
  );
}

export default Profile;
