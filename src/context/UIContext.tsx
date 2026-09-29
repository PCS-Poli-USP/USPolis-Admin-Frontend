import React, { createContext, useEffect, useState } from 'react';

export enum UIViewType {
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  TABLET = 'tablet',
}

interface UIContext {
  isOpenMenu: boolean;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  view: UIViewType;
  isMobile: boolean;
  isDesktop: boolean;
  isTablet: boolean;
}

const defaultUIContext: UIContext = {
  isOpenMenu: false,
  onOpenMenu: () => {},
  onCloseMenu: () => {},
  view: UIViewType.DESKTOP,
  isMobile: false,
  isDesktop: true,
  isTablet: false,
};

export const uiContext = createContext<UIContext>(defaultUIContext);

export default function UIContextProvider({
  children,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
}: React.PropsWithChildren<{}>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [view, setView] = useState<UIViewType>(UIViewType.DESKTOP);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const value = {
    isOpenMenu: isOpen,
    onOpenMenu: onOpen,
    onCloseMenu: onClose,
    view,
    isMobile: view === UIViewType.MOBILE,
    isDesktop: view === UIViewType.DESKTOP,
    isTablet: view === UIViewType.TABLET,
  };

  function handleResize() {
    const width = window.innerWidth;
    if (width < 768) {
      setView(UIViewType.MOBILE);
    } else if (width >= 768 && width < 1024) {
      setView(UIViewType.TABLET);
    } else {
      setView(UIViewType.DESKTOP);
    }
  }

  console.log('Current view:', view);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <uiContext.Provider value={value}>{children}</uiContext.Provider>;
}
