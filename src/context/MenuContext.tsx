import React, { createContext, useState } from 'react';

interface MenuContext {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const defaultMenuContext: MenuContext = {
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
};

export const menuContext = createContext<MenuContext>(defaultMenuContext);

export default function MenuContextProvider({
  children,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
}: React.PropsWithChildren<{}>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const value = {
    isOpen,
    onOpen,
    onClose,
  };

  return <menuContext.Provider value={value}>{children}</menuContext.Provider>;
}
