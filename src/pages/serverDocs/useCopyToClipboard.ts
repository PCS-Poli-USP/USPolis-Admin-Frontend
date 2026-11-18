import { useEffect, useRef, useState } from 'react';

// Copies text and flags `copied` for a moment, for the "Copiado!" feedback of
// the path chips and command blocks. On a phone, tapping copy beats selecting
// a long path or command by hand.
export function useCopyToClipboard(resetAfterMs = 1300) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  async function copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // No clipboard access (insecure origin, permission denied): the text
      // stays visible and selectable, so just don't claim it was copied.
      return false;
    }
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), resetAfterMs);
    return true;
  }

  return { copied, copy };
}
