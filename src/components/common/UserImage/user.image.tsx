import { Box, Center, Icon, Image, SkeletonCircle } from '@chakra-ui/react';
import { useContext } from 'react';
import { FaUser } from 'react-icons/fa';
import { appContext } from '../../../context/AppContext';

interface UserImageProps {
  boxSize?: string;
}

export default function UserImage({ boxSize = '40px' }: UserImageProps) {
  const { loading, loggedUser } = useContext(appContext);

  return (
    <Box
      justifyContent={'center'}
      alignContent={'center'}
      flexDir={'column'}
      display={'flex'}
      w={'fit-content'}
    >
      {loggedUser && !loading ? (
        <Center>
          <Image
            boxSize={boxSize}
            borderRadius={'full'}
            src={loggedUser.user_info?.picture}
            border={'1px black solid'}
            onLoad={() => {
              console.log('Image loaded successfully');
            }}
            fallback={
              <Box
                boxSize={`calc(${boxSize})`}
                display='flex'
                alignItems='center'
                justifyContent='center'
                bg='gray.100'
                color='gray.500'
                borderColor={'black'}
                border={'2px'}
                borderRadius={'full'}
              >
                <Icon as={FaUser} boxSize={`calc(${boxSize} - 10px)`} />
              </Box>
            }
          />
        </Center>
      ) : (
        <SkeletonCircle boxSize={boxSize} />
      )}
    </Box>
  );
}
