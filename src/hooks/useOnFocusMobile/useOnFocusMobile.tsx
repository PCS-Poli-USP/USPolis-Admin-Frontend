import { useMediaQuery } from '@chakra-ui/react';
import { useState } from 'react';

export interface FocusMobileReturn {
  onFocusInput: (
    event: React.FocusEvent<HTMLInputElement>,
    pb?: number,
  ) => void;
  onFocusTextArea: (
    event: React.FocusEvent<HTMLTextAreaElement>,
    pb?: number,
  ) => void;
  onBlur: () => void;
  isOnFocus: boolean;
  isMobile: boolean;
  paddingBottom: number;
  setPaddingBottom: React.Dispatch<React.SetStateAction<number>>;
}

export function useOnFocusMobile() {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const [isOnFocus, setIsOnFocus] = useState(false);
  const [paddingBottom, setPaddingBottom] = useState(250);

  function onFocusInput(
    event: React.FocusEvent<HTMLInputElement>,
    pb?: number,
  ) {
    const el = event.target as HTMLInputElement;
    const rect = el.getBoundingClientRect(); // posição dentro da tela
    const viewport = window.visualViewport;
    if (!viewport) return; // fallback para browsers antigos
    const halfViewport = viewport.height * 0.6;

    if (rect.top > halfViewport)
      setTimeout(() => {
        event.target.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 200);
    if (pb) setPaddingBottom(pb);
    setIsOnFocus(true);
  }

  function onFocusTextArea(
    event: React.FocusEvent<HTMLTextAreaElement>,
    pb?: number,
  ) {
    const el = event.target as HTMLTextAreaElement;
    const rect = el.getBoundingClientRect(); // posição dentro da tela
    const viewport = window.visualViewport;
    if (!viewport) return; // fallback para browsers antigos
    const halfViewport = viewport.height * 0.6;

    if (rect.top > halfViewport)
      setTimeout(() => {
        if (!isMobile) return;
        event.target.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 200);
    if (pb) setPaddingBottom(pb);
    setIsOnFocus(true);
  }

  function onBlur() {
    setIsOnFocus(false);
  }

  return {
    onFocusInput,
    onFocusTextArea,
    onBlur,
    isOnFocus,
    isMobile,
    paddingBottom,
    setPaddingBottom,
  };
}
