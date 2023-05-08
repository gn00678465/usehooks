import { RefObject, useEffect, useRef, useState, useCallback } from 'react';

export interface ResizeObserverSize {
  readonly inlineSize: number;
  readonly blockSize: number;
}

export interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
  readonly borderBoxSize?: ReadonlyArray<ResizeObserverSize>;
  readonly contentBoxSize?: ReadonlyArray<ResizeObserverSize>;
  readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>;
}

export type ResizeObserverCallback = (
  entries: ReadonlyArray<ResizeObserverEntry>,
  observer: ResizeObserver
) => void;

export interface UseResizeObserverOptions {
  /**
   *
   * @default 'content-box'
   */
  box?: ResizeObserverBoxOptions;
}

declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback);
  disconnect(): void;
  observe(target: Element, options?: UseResizeObserverOptions): void;
  unobserve(target: Element): void;
}

export function useResizeObserver(
  target: RefObject<Element> | RefObject<Element>[],
  cb: ResizeObserverCallback,
  options: UseResizeObserverOptions = {}
) {
  const [targets, setTargets] = useState<(Element | null)[]>();
  const [running, setRunning] = useState(false);

  const observer = useRef<ResizeObserver | undefined>(undefined);

  const callback = useCallback(cb, [cb]);

  const cleanup = useCallback(() => {
    if (observer.current) {
      observer.current.disconnect();
      observer.current = undefined;
    }
  }, []);

  const stop = useCallback(() => {
    cleanup();
    setRunning(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setRunning(true);
  }, []);

  useEffect(() => {
    setTargets(
      Array.isArray(target) ? target.map((t) => t.current) : [target.current]
    );
  }, [target]);

  useEffect(() => {
    if (running) {
      cleanup();
      if (window && targets) {
        observer.current = new ResizeObserver(callback);
        for (const el of targets) {
          el && observer.current.observe(el, options);
        }
      }
    }
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targets]);

  return {
    stop
  };
}

export type useResizeObserverReturn = ReturnType<typeof useResizeObserver>;
