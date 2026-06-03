import { useState, useEffect } from 'react';

/**
 * Hook para persistir o estado de abertura/fechamento de seções do drawer
 * usando localStorage
 */
export function useDrawerState(key: string, initialValue: boolean = false) {
  const [state, setState] = useState<boolean>(() => {
    // Obter do localStorage na inicialização
    try {
      const item = window.localStorage.getItem(`drawer_${key}`);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Persistir no localStorage quando o estado muda
  useEffect(() => {
    try {
      window.localStorage.setItem(`drawer_${key}`, JSON.stringify(state));
    } catch {
      console.error(`Erro ao salvar drawer state para ${key}`);
    }
  }, [state, key]);

  return [state, setState] as const;
}
