import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  IconButton,
  useDisclosure,
  PlacementWithLogical,
} from '@chakra-ui/react';
import { LuBadgeHelp } from 'react-icons/lu';

interface HelpPopoverProps {
  title: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  placement?: PlacementWithLogical;
}

function HelpPopover({
  title,
  children,
  size = 'sm',
  placement = undefined,
}: HelpPopoverProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      closeOnBlur={false}
      placement={placement}
    >
      <PopoverTrigger>
        <IconButton
          size={size}
          aria-label={'help-popover-button'}
          icon={<LuBadgeHelp />}
          variant={'ghost'}
          colorScheme='blue'
          color={'uspolis.blue'}
        />
      </PopoverTrigger>
      <PopoverContent p={5}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight='bold'>{title}</PopoverHeader>
        <PopoverBody>{children}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
export default HelpPopover;
