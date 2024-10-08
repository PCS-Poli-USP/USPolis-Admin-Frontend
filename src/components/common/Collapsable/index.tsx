import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Flex, Heading } from '@chakra-ui/react';
import { useState } from 'react';

interface props {
  title: string;
  children: React.ReactNode;
}

const Collapsable = ({ children, title }: props) => {
  const [open, setOpen] = useState(false);

  return (
    <Flex direction='column'>
      <Flex alignItems="center">
        <div
          onClick={() => {
            setOpen(!open);
          }}
        >
          {open ? <ChevronDownIcon boxSize={10} /> : <ChevronRightIcon boxSize={10}/>}
        </div>
        <Heading size='md'>{title}</Heading>
      </Flex>
      {open ? <div>{children}</div> : <></>}
    </Flex>
  );
};

export { Collapsable };
