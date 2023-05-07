import { useState, useEffect } from 'react';
import { isBrowser } from '../..';

export interface useWindowSizeOptions {
  initialWidth?: number;
  initialHeight?: number;
  includeScrollbar?: boolean;
}

export function useWindowSize(options: useWindowSizeOptions) {
  const {
    initialWidth = Infinity,
    initialHeight = Infinity,
    includeScrollbar = true
  } = options;

  const [state, setState] = useState({
    width: initialWidth,
    height: initialHeight
  });

  useEffect(() => {
    if (isBrowser) {
      const handle = () => {
        if (includeScrollbar) {
          setState(() => ({
            width: window.innerWidth,
            height: window.innerHeight
          }));
        } else {
          setState(() => ({
            width: window.document.documentElement.clientWidth,
            height: window.document.documentElement.clientHeight
          }));
        }
      };

      window.addEventListener('resize', handle, { passive: true });

      return () => {
        window.removeEventListener('resize', handle);
      };
    }
  }, []);

  return state;
}

export type UseWindowSizeReturn = ReturnType<typeof useWindowSize>
