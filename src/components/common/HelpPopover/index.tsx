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
  Tooltip,
  Box,
  Portal,
} from '@chakra-ui/react';
import { LuBadgeHelp } from 'react-icons/lu';

interface HelpPopoverProps {
  title: string;
  children?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  placement?: PlacementWithLogical;
  tooltip?: string;
  tooltipPlacement?: PlacementWithLogical;
  ariaLabel?: string;
  // Renders the content in document.body, so it is not clipped or styled by
  // its container (e.g. inside a table header)
  inPortal?: boolean;
}

function HelpPopover({
  title,
  children,
  size = 'sm',
  placement = undefined,
  tooltip = undefined,
  tooltipPlacement = 'top',
  ariaLabel = 'help-popover-button',
  inPortal = false,
}: HelpPopoverProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const content = (
    <PopoverContent p={5}>
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader fontWeight='bold'>{title}</PopoverHeader>
      <PopoverBody>{children}</PopoverBody>
    </PopoverContent>
  );
  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      closeOnBlur={false}
      placement={placement}
    >
      <PopoverTrigger>
        <Box>
          <Tooltip
            label={tooltip}
            placement={tooltipPlacement}
            hasArrow
            isDisabled={!tooltip || isOpen}
          >
            <IconButton
              size={size}
              aria-label={ariaLabel}
              icon={<LuBadgeHelp />}
              variant={'ghost'}
              colorScheme='blue'
              color={'uspolis.blue'}
            />
          </Tooltip>
        </Box>
      </PopoverTrigger>
      {inPortal ? <Portal>{content}</Portal> : content}
    </Popover>
  );
}
export default HelpPopover;
