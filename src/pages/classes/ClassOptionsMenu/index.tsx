import { AddIcon } from '@chakra-ui/icons';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

interface ClassOptionsMenuProps {
  children?: ReactNode;
}

function ClassOptionsMenu({ children }: ClassOptionsMenuProps) {
  return (
    <Menu>
      <MenuButton
        as={Button}
        colorScheme='blue'
        leftIcon={<AddIcon />}
        borderRadius={'20px'}
      >
        Opções
      </MenuButton>
      <MenuList>{children}</MenuList>
    </Menu>
  );
}
export default ClassOptionsMenu;
