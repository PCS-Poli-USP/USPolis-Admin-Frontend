import { useMediaQuery } from '@chakra-ui/react';
import { useRef, useState } from 'react';

export interface FocusMobileReturn {
  onFocusInput: (
    event: React.FocusEvent<HTMLInputElement>,
    container?: HTMLElement | null,
    pb?: number,
  ) => void;
  onFocusTextArea: (
    event: React.FocusEvent<HTMLTextAreaElement>,
    container?: HTMLElement | null,
    pb?: number,
  ) => void;
  onBlur: (container?: HTMLElement | null) => void;
  isOnFocus: boolean;
  isMobile: boolean;
  paddingBottom: number;
  setPaddingBottom: React.Dispatch<React.SetStateAction<number>>;
  markIgnoreNextBlur: () => void;
}

export function useOnFocusMobile() {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const [isOnFocus, setIsOnFocus] = useState(false);
  const [paddingBottom, setPaddingBottom] = useState(500);

  // flag para ignorar um blur causado por mousedown em selects (opcional)
  const ignoreNextBlurRef = useRef(false);

  function isElementInside(container: HTMLElement | null, el: Element | null) {
    if (!container || !el) return false;
    return container === el || container.contains(el);
  }

  function markIgnoreNextBlur() {
    // chamar no onMouseDown do select, se necessário
    ignoreNextBlurRef.current = true;
    // depois de um curto período, libera
    setTimeout(() => {
      ignoreNextBlurRef.current = false;
    }, 300);
  }

  function scrollToKeepVisible(
    element: HTMLElement,
    container?: HTMLElement | null,
  ) {
    if (!container) {
      // fallback
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    setTimeout(() => {
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Distância do topo visível do container
      const relativeTop = rect.top - containerRect.top;

      const marginTop = 35; // margem opcional superior

      // Quanto deveria ser o scrollTop para deixar o input lá no alto
      const idealScrollTop = container.scrollTop + relativeTop - marginTop;

      // Quanto o container consegue scrollar no máximo
      const maxScrollTop = container.scrollHeight - container.clientHeight;

      // Scroll final = o menor entre ideal e máximo
      const finalScrollTop = Math.min(idealScrollTop, maxScrollTop);

      container.scrollTo({
        top: finalScrollTop,
        behavior: 'smooth',
      });
    }, 80); // espera teclado subir
  }

  function onFocusInput(
    event: React.FocusEvent<HTMLInputElement>,
    container?: HTMLElement | null,
    pb?: number,
  ) {
    if (!isMobile) return;

    scrollToKeepVisible(event.target, container);

    if (pb) setPaddingBottom(pb);
    setIsOnFocus(true);
  }

  function onFocusTextArea(
    event: React.FocusEvent<HTMLTextAreaElement>,
    container?: HTMLElement | null,
    pb?: number,
  ) {
    if (!isMobile) return;

    scrollToKeepVisible(event.target, container);

    if (pb) setPaddingBottom(pb);
    setIsOnFocus(true);
  }

  function onBlur(container?: HTMLElement | null) {
    // se marcamos para ignorar, não limpamos
    if (ignoreNextBlurRef.current) return;

    // adiar limpeza para permitir que foco mude para outro input dentro do mesmo container
    requestAnimationFrame(() => {
      // se o foco atual (document.activeElement) estiver dentro do container, não limpa
      if (isElementInside(container ?? null, document.activeElement)) {
        // ainda está dentro do modal/container: não limpa
        return;
      }

      // caso não esteja, limpa o estado
      setIsOnFocus(false);
      // opcional: reset padding para valor padrão
      // setPaddingBottom(350);
    });
  }

  return {
    onFocusInput,
    onFocusTextArea,
    onBlur,
    isOnFocus,
    isMobile,
    paddingBottom,
    setPaddingBottom,
    markIgnoreNextBlur,
  };
}
