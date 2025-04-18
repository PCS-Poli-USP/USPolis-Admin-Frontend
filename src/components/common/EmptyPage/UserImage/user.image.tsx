import { Box, Center, Icon, Image } from '@chakra-ui/react';
import { UserResponse } from '../../../../models/http/responses/user.response.models';
import { useState } from 'react';
import { FaUser } from 'react-icons/fa';

interface UserImageProps {
  user: UserResponse;
  boxSize?: string;
}

export default function UserImage({ user, boxSize = '40px' }: UserImageProps) {
  const [hasError, setHasError] = useState(false);
  return (
    <Box
      boxSize={`calc(${boxSize} + 10px)`}
      w={'full'}
      justifyContent={'center'}
      alignContent={'center'}
    >
      {!hasError ? (
        <Center>
          <Image
            boxSize={boxSize}
            borderRadius={'full'}
            src={user.user_info?.picture}
            borderColor={'black'}
            border={'2px'}
            onError={() => setHasError(true)}
          />
        </Center>
      ) : (
        <Box
          boxSize='100%'
          display='flex'
          alignItems='center'
          justifyContent='center'
          bg='gray.100'
          color='gray.500'
          borderColor={'black'}
          border={'2px'}
          borderRadius={'full'}
        >
          <Icon as={FaUser} boxSize={boxSize} />
        </Box>
      )}
    </Box>
  );
}
