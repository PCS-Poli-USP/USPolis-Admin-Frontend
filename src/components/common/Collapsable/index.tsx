import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Flex, Heading } from '@chakra-ui/react';
import { useState } from 'react';

interface props {
  title: string;
  children: React.ReactNode;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  iconSize?: number | string;
  titleSize?: string;
  titleColor?: string;
  initiallyOpen?: boolean;
  border?: string;
  borderRadius?: string;
  p?: string;
  gap?: string;
  fontWeight?: string;
  mb?: string;
}

const Collapsable = ({
  children,
  title,
  openIcon,
  closeIcon,
  iconSize,
  titleSize = 'md',
  titleColor = 'uspolis.blue',
  initiallyOpen = false,
  border = 'none',
  borderRadius = 'none',
  p = undefined,
  fontWeight = 'bold',
  gap = undefined,
  mb = undefined,
}: props) => {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <Flex
      direction='column'
      border={border}
      borderRadius={borderRadius}
      p={p}
      gap={gap}
      mb={mb}
    >
      <Flex alignItems='center'>
        <div
          onClick={() => {
            setOpen(!open);
          }}
        >
          {open ? (
            openIcon ? (
              openIcon
            ) : (
              <ChevronDownIcon boxSize={iconSize ? iconSize : 10} />
            )
          ) : closeIcon ? (
            closeIcon
          ) : (
            <ChevronRightIcon boxSize={iconSize ? iconSize : 10} />
          )}
        </div>
        <Heading
          size={titleSize}
          maxW={'800px'}
          textOverflow={'ellipsis'}
          overflow={'hidden'}
          fontWeight={fontWeight}
          color={titleColor}
        >
          {title}
        </Heading>
      </Flex>
      <div style={{ display: open ? 'block' : 'none' }}>{children}</div>
    </Flex>
  );
};

export { Collapsable };
