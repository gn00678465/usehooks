import { RefObject, useEffect, useState } from 'react';
import { useResizeObserver } from '..';
import type { UseResizeObserverOptions } from '..';

export interface ElementSize {
  width: number;
  height: number;
}

export type UseElementSizeReturn = [number, number];

export function useElementSize(
  target: RefObject<Element>,
  initialSize: ElementSize = { width: 0, height: 0 },
  options: UseResizeObserverOptions = {}
): UseElementSizeReturn {
  const { box = 'content-box' } = options;
  const [width, setWidth] = useState(initialSize.width);
  const [height, setHeight] = useState(initialSize.height);

  useResizeObserver(target, ([entry]) => {
    const boxSize =
      box === 'border-box'
        ? entry.borderBoxSize
        : box === 'content-box'
        ? entry.contentBoxSize
        : entry.devicePixelContentBoxSize;
    if (window) {
      const $elm = target.current;
      if ($elm) {
        const styles = window.getComputedStyle($elm);
        setWidth(parseFloat(styles.width));
        setHeight(parseFloat(styles.height));
      }
    } else {
      if (boxSize) {
        const formatBoxSize = Array.isArray(boxSize) ? boxSize : [boxSize];
        setWidth(
          formatBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0)
        );
        setHeight(
          formatBoxSize.reduce((acc, { blockSize }) => acc + blockSize, 0)
        );
      } else {
        setWidth(entry.contentRect.width);
        setHeight(entry.contentRect.height);
      }
    }
  });

  useEffect(() => {
    setWidth(target.current ? initialSize.width : 0);
    setHeight(target.current ? initialSize.height : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return [width, height];
}
