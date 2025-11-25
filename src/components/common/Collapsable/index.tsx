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
  p?: string;
  fontWeight?: string;
}

const Collapsable = ({
  children,
  title,
  openIcon,
  closeIcon,
  iconSize,
  titleSize = 'md',
  titleColor = 'uspolis.text',
  initiallyOpen = false,
  border = 'none',
  p = undefined,
  fontWeight = 'bold',
}: props) => {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <Flex direction='column' border={border} p={p}>
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
          textColor={titleColor}
        >
          {title}
        </Heading>
      </Flex>
      <div style={{ display: open ? 'block' : 'none' }}>{children}</div>
    </Flex>
  );
};

export { Collapsable };
