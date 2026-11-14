import { useCallback, useEffect, useRef, useState } from "react";

const RESET_MS = 1500;

/** copy() resolves true on success, false if the clipboard API is missing or rejects. */
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator.clipboard?.writeText) return false;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return false;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), RESET_MS);
    return true;
  }, []);

  return { copied, copy };
}
