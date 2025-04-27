import { Box, Center, Icon, Image } from '@chakra-ui/react';
import { UserResponse } from '../../../models/http/responses/user.response.models';
import { useState } from 'react';
import { FaUser } from 'react-icons/fa';

interface UserImageProps {
  user: UserResponse;
  boxSize?: string;
}

export default function UserImage({ user, boxSize = '40px' }: UserImageProps) {
  const [hasError, setHasError] = useState(false);
  const url = user.user_info?.picture;
  console.log('UserImage', url);

  return (
    <Box
      boxSize={`calc(${boxSize} + 10px)`}
      justifyContent={'center'}
      alignContent={'center'}
    >
      {!hasError ? (
        <Center>
          <Image
            boxSize={boxSize}
            borderRadius={'full'}
            src={url}
            border={'1px black solid'}
            onError={(data) => {
              console.log('Error loading image', data);
              setHasError(true);
            }}
            onLoad={() => setHasError(false)}
          />
        </Center>
      ) : (
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
          <Icon as={FaUser} boxSize={`calc(${boxSize} - 0px)`} />
        </Box>
      )}
    </Box>
  );
}
