import { Box, Center, Icon, Image, SkeletonCircle } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { appContext } from '../../../context/AppContext';

interface UserImageProps {
  boxSize?: string;
  // Omitted: the logged-in user's picture. Passed (even null): that picture,
  // or the placeholder when it's null. Another user's row must never fall
  // back to the logged-in user's face.
  url?: string | null;
}

export default function UserImage({
  boxSize = '40px',
  url = undefined,
}: UserImageProps) {
  const { loading, loggedUser } = useContext(appContext);
  const numBoxSize = Number(boxSize.replace('px', ''));
  const src =
    url === undefined
      ? loggedUser?.picture_url || loggedUser?.user_info?.picture
      : url;

  // Chakra's `fallback` preloads the image with `new Image()`, which ignores
  // referrerPolicy. The <img> loads it directly instead, and a failed load
  // switches to the placeholder here. Keyed by URL, so a new picture gets
  // its own try.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = !!src && failedSrc === src;

  const placeholder = (
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
      <Icon as={FaUser} boxSize={`calc(${boxSize} - ${numBoxSize * 0.25}px)`} />
    </Box>
  );

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
          {src && !failed ? (
            <Image
              boxSize={boxSize}
              borderRadius={'full'}
              src={src}
              alt={''}
              ignoreFallback
              // Google's image host (lh3.googleusercontent.com) may refuse
              // requests that carry a Referer from another site.
              referrerPolicy={'no-referrer'}
              border={'1px black solid'}
              onError={() => setFailedSrc(src)}
            />
          ) : (
            placeholder
          )}
        </Center>
      ) : (
        <SkeletonCircle boxSize={boxSize} />
      )}
    </Box>
  );
}
