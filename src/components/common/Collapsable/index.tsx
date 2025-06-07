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
}

const Collapsable = ({
  children,
  title,
  openIcon,
  closeIcon,
  iconSize,
  titleSize = 'md',
}: props) => {
  const [open, setOpen] = useState(false);

  return (
    <Flex direction='column'>
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
        >
          {title}
        </Heading>
      </Flex>
      <div style={{ display: open ? 'block' : 'none' }}>{children}</div>
    </Flex>
  );
};

export { Collapsable };
